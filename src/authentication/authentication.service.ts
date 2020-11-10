import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/user.model";
import { PartialUser } from "../user/user.types";
import { ISignInResult, ITokenPayload } from "./authentication.types";
import * as bcrypt from "bcrypt";
import { Credential } from "./credential.model";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../config/environment-variables.class";
import { addToDate } from "../common/utils/add-to-date.util";
import { v4 as generateUuid } from "uuid";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    @Inject(Credential) private readonly credentialModel: typeof Credential
  ) {
  }

  private async deleteExpiredRefreshTokens(): Promise<void> {
    await this.credentialModel.query()
      .delete()
      .whereRaw(`"refreshTokenExpiresAt" < now()`);
  }

  private hashRefreshToken(refreshToken: string) {
    return crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
  }

  private async assertRefreshTokenOwnership(refreshToken: string, user: PartialUser): Promise<void> {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const count = await this.credentialModel.query()
      .where({ refreshToken: refreshTokenHash, userId: user.id })
      .resultSize();

    if (count !== 1) {
      throw new NotFoundException(`Refresh token ${refreshToken} is not found`);
    }
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const refreshToken = generateUuid();
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = addToDate(new Date(), this.configService.get("AUTH_REFRESH_TOKEN_TTL"));
    await this.credentialModel.query().insert({
      refreshToken: refreshTokenHash,
      refreshTokenExpiresAt,
      userId
    });
    return refreshToken;
  }

  private async validateRefreshToken(refreshToken: string): Promise<User> {
    await this.deleteExpiredRefreshTokens();
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const deletedCredential = await this.credentialModel.query()
      .delete()
      .where({ refreshToken: refreshTokenHash })
      .returning("userId")
      .then(credentials => credentials[0]);

    if (!deletedCredential) {
      throw new NotFoundException(`Refresh token ${refreshToken} is not found`);
    }

    const user = await this.userService.get(deletedCredential.userId, {
      disableAccessControlHooks: true,
      disablePopulateHooks: true
    });
    // PostgreSQL provides foreign key constraints, so user should not be null. But:
    // 1. In the future, the user service may change its internal storage
    // 2. There could be a race condition
    if (!user) {
      throw new NotFoundException(`User with id ${deletedCredential.userId} is not found`);
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException("User is not found");
    }
    const comparisonResult = await bcrypt.compare(password, user.password);
    if (!comparisonResult) {
      throw new UnauthorizedException();
    }
    if (!user.isEmailConfirmed) {
      throw new ForbiddenException("Email is not confirmed");
    }
    return user;
  }

  async signIn(user: PartialUser): Promise<ISignInResult> {
    const payload: ITokenPayload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const { exp: accessTokenExpiresAt } = this.jwtService.decode(accessToken) as Record<string, any>;
    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken: await this.createRefreshToken(user.id)
    };
  }

  async signOut(user: PartialUser, refreshToken: string): Promise<void> {
    await this.assertRefreshTokenOwnership(refreshToken, user);
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    await this.credentialModel.query()
      .delete()
      .where({ refreshToken: refreshTokenHash });
  }

  async terminateAllOtherSessions(user: PartialUser, refreshToken: string) {
    await this.assertRefreshTokenOwnership(refreshToken, user);
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    await this.credentialModel.query()
      .delete()
      .where("userId", user.id)
      .andWhere("refreshToken", "!=", refreshTokenHash);
  }

  async refreshAccessToken(refreshToken: string): Promise<ISignInResult> {
    const user = await this.validateRefreshToken(refreshToken);
    return this.signIn(user);
  }
}
