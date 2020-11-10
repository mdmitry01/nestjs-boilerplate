import { IHook } from "../../hooks/hooks.types";
import { NextFunction } from "@feathersjs/hooks";
import { ExtractModel, ICrudHookContext } from "../crud.types";
import { isPaginatedCrudServiceResult } from "../utils/is-paginated-crud-service-result.util";
import * as  util from "util";
import {
  BadRequestException,
  ForbiddenException,
  Logger,
  NotFoundException,
  PayloadTooLargeException
} from "@nestjs/common";
import { Identifier, IWithId, OnlyWithId } from "../../types/common.types";
import { addToQuery } from "../utils/add-to-query.util";
import { AdapterService } from "@feathersjs/adapter-commons";

export abstract class AbstractAccessControlHook<TService extends AdapterService<TModel>,
  TModel extends IWithId = OnlyWithId<ExtractModel<TService>>> implements IHook<TService> {
  private static readonly DATA_LENGTH_LIMIT = 100;
  protected readonly logger = new Logger(this.constructor.name);

  protected beforeAll?(context: ICrudHookContext<TService>): Promise<void> | void;

  protected beforeRead?(context: ICrudHookContext<TService>): Promise<void> | void;

  protected beforeSave?(record: Partial<TModel>, context: ICrudHookContext<TService>): Promise<void> | void;

  protected abstract canSave(record: Partial<TModel>, context: ICrudHookContext<TService>): Promise<boolean> | boolean;

  private async checkSavePermissions(context: ICrudHookContext<TService>): Promise<void> {
    const promises = context.args.normalizedData.map(async record => {
      if (this.beforeSave) {
        await this.beforeSave(record, context);
      }
      if (!await this.canSave(record, context)) {
        this.logger.error({
          message: "Can't save the data " + util.inspect(context.args.data),
          userId: context.args.params.user?.id
        });
        throw new ForbiddenException("Can't save the data");
      }
    });
    await Promise.all(promises);
  }

  private async applyReadPermissions(context: ICrudHookContext<TService>): Promise<void> {
    if (!this.beforeRead && !this.beforeAll) {
      return;
    }
    const affectedRecordIds = await this.loadAffectedRecordIds(context);
    if (!affectedRecordIds.length) {
      throw new NotFoundException("No records found");
    }
    const { args } = context;
    if (args.id !== null) {
      if (args.id !== affectedRecordIds[0]) {
        throw new NotFoundException("Can't find record with id " + args.id);
      }
    } else {
      args.params = addToQuery(args.params, { id: { $in: affectedRecordIds } });
    }
  }

  private async onCreate(context: ICrudHookContext<TService>): Promise<void> {
    if (context.args.normalizedData.length > AbstractAccessControlHook.DATA_LENGTH_LIMIT) {
      throw new PayloadTooLargeException(
        "Too many records to create. The limit is " +
        AbstractAccessControlHook.DATA_LENGTH_LIMIT
      );
    }
    await this.checkSavePermissions(context);
  }

  private async onUpdate(context: ICrudHookContext<TService>): Promise<void> {
    await this.applyReadPermissions(context);
    await this.checkSavePermissions(context);
  }

  private async onPatch(context: ICrudHookContext<TService>): Promise<void> {
    await this.applyReadPermissions(context);
    await this.checkSavePermissions(context);
  }

  private async onRemove(context: ICrudHookContext<TService>): Promise<void> {
    await this.applyReadPermissions(context);
  }

  private async loadAffectedRecordIds(context: ICrudHookContext<TService>): Promise<Identifier[]> {
    const { args } = context;
    // With id `null` we can change multiple items. See:
    // * https://docs.feathersjs.com/api/databases/common.html#options
    // * https://github.com/feathersjs/databases/blob/5bc164c72e93637569a3cfaa57f9e862b2d1c507/packages/adapter-commons/src/service.ts#L186
    if (args.id !== null) {
      const record = await context.self.get(args.id, {
        ...args.params,
        query: { $select: ["id"] },
        disablePopulateHooks: true
      });
      if (!record) {
        return [];
      }
      return [record.id];
    }

    const paginatedResult = await context.self.find({
      ...args.params,
      query: {
        ...args.params.query,
        $select: ["id"],
        $limit: AbstractAccessControlHook.DATA_LENGTH_LIMIT
      },
      disablePopulateHooks: true
    });
    if (!isPaginatedCrudServiceResult(paginatedResult)) {
      throw new Error("Unexpected return value from find() method. " + util.inspect(paginatedResult));
    }
    if (paginatedResult.total > AbstractAccessControlHook.DATA_LENGTH_LIMIT) {
      throw new BadRequestException(
        "Too many records affected. The limit is " +
        AbstractAccessControlHook.DATA_LENGTH_LIMIT
      );
    }
    return paginatedResult.data.map(dataItem => dataItem.id);
  }

  async process(context: ICrudHookContext<TService>, next: NextFunction): Promise<void> {
    if (context.args.params.disableAccessControlHooks) {
      return next();
    }

    if (this.beforeAll) {
      await this.beforeAll(context);
    }

    switch (context.method) {
      case "find":
      case "get":
        if (this.beforeRead) {
          await this.beforeRead(context);
        }
        break;
      case "create":
        await this.onCreate(context);
        break;
      case "update":
        await this.onUpdate(context);
        break;
      case "patch":
        await this.onPatch(context);
        break;
      case "remove":
        await this.onRemove(context);
        break;
      default:
        throw new Error("Unexpected method name " + context.method);
    }
    await next();
  }
}
