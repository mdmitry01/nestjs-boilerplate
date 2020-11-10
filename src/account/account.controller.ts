import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthenticationService } from "../authentication/authentication.service";
import { Request, Response } from "express";
import { LocalAuthGuard } from "../authentication/guards/local-auth.guard";
import { SignInDto } from "./dto/sign-in.dto";
import { SkipJwtAuthGuard } from "../authentication/decorators/skip-jwt-auth-guard.decorator";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { AccountService } from "./account.service";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../config/environment-variables.class";
import ms = require("ms");
import { CookieOptions } from "express-serve-static-core";
import { TerminateAllOtherSessionsDto } from "./dto/terminate-all-other-sessions.dto";

@Controller("account")
@ApiTags("account")
export class AccountController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly accountService: AccountService,
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {
  }

  private setRefreshTokenCookie(refreshToken: string, response: Response) {
    const cookieOptions: CookieOptions = {
      maxAge: ms(this.configService.get("AUTH_REFRESH_TOKEN_TTL") as string),
      httpOnly: true,
      path: "/account/"
    };

    if (this.configService.get("ENV") !== "local") {
      cookieOptions.secure = true;
      // This server is designed to be an API server.
      // Thus, the server and frontend may have different origins (domain, protocol and port).
      // Therefore, this server should send CORS headers, including 'Access-Control-Allow-Credentials' header.
      // But with 'SameSite=Strict' or 'SameSite=Lax' attribute, cookies won't be sent to the server.
      // To fix this, we set 'SameSite' to 'None', and this could potentially allow a CSRF attack on
      // 'refresh-access-token' endpoint (other endpoints such as 'sign-out' and 'terminate-all-other-sessions' are
      // protected because they require an access token in the Authorization header).
      // But in our case, this attack is harmless, because an attacker can call the 'refresh-access-token' HTTP
      // endpoint, but **cannot** read the HTTP response.
      // Yes, it may log the user out, but it's not an issue
      // (see https://sites.google.com/site/bughunteruniversity/nonvuln/logout-xsrf).
      // For more protection, you can implement a CSRF token validation to prevent this behavior.
      // Or, just don't use cookies to store the refresh token and store it in localStorage,
      // but in this case, your refresh token can be easily stolen in case of an XSS attack.
      cookieOptions.sameSite = "none";
    }

    response.cookie("refreshToken", refreshToken, cookieOptions);
  }

  private extractRefreshToken(request: Request, dto?: { refreshToken?: string }): string {
    if (dto && "refreshToken" in dto) {
      return dto.refreshToken;
    }
    if ("refreshToken" in request.cookies) {
      return request.cookies.refreshToken;
    }
    throw new BadRequestException("refreshToken is missing");
  }

  @Post("sign-in")
  @SkipJwtAuthGuard()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInDto })
  async signIn(@Req() request: Request, @Res() response: Response) {
    const signInResult = await this.authenticationService.signIn(request.user);
    this.setRefreshTokenCookie(signInResult.refreshToken, response);
    response.json(signInResult);
  }

  @Post("refresh-access-token")
  @SkipJwtAuthGuard()
  @ApiBody({ type: RefreshAccessTokenDto, required: false })
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
    @Req() request: Request,
    @Res() response: Response
  ) {
    const refreshToken = this.extractRefreshToken(request, refreshAccessTokenDto);
    const signInResult = await this.authenticationService.refreshAccessToken(refreshToken);
    this.setRefreshTokenCookie(signInResult.refreshToken, response);
    response.json(signInResult);
  }

  // If you don't store the refresh token in an HTTP-only cookie
  // (for example, you have a mobile app), you don't need this endpoint.
  // Just remove the access and refresh tokens on your client.
  @Post("sign-out")
  @ApiBearerAuth()
  async signOut(@Req() request: Request) {
    const refreshToken = this.extractRefreshToken(request);
    await this.authenticationService.signOut(request.user, refreshToken);
  }

  @Post("terminate-all-other-sessions")
  @ApiBearerAuth()
  @ApiBody({ type: TerminateAllOtherSessionsDto, required: false })
  async terminateAllOtherSessions(
    @Body() terminateAllOtherSessionsDto: TerminateAllOtherSessionsDto,
    @Req() request: Request
  ) {
    const refreshToken = this.extractRefreshToken(request, terminateAllOtherSessionsDto);
    await this.authenticationService.terminateAllOtherSessions(request.user, refreshToken);
  }

  @Get("profile")
  @ApiBearerAuth()
  getProfile(@Req() request: Request) {
    return this.accountService.getProfile(request.user);
  }
}
