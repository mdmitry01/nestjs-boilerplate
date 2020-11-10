## NestJS Boilerplate

### Getting started

```bash
npm i
npm run set-env:local
docker-compose up -d
npm run db-migrate:latest
npm run db-seeder:run
npm run start:dev
# or if you want to log SQL queries
DEBUG=knex:query,knex:bindings npm run start:dev
```

Open your browser and navigate to http://localhost:3000/api

### This project uses

* TypeScript
* PostgreSQL
* [Objection.js](https://vincit.github.io/objection.js/): an SQL-friendly ORM for Node.js
* [Feathers database adapters](https://docs.feathersjs.com/api/databases/adapters.html)
* [@feathersjs/hooks](https://github.com/feathersjs/hooks): async middleware for JavaScript and TypeScript
* Swagger
* JWT Authentication
* Docker

### Feathers database adapters

You can use the [Feathers database adapters](https://docs.feathersjs.com/api/databases/adapters.html) in this project.

#### Example

```typescript
import { Service } from "feathers-objection";

export class ObjectionCrudService<T> extends FeathersServiceAdapter(Service)<T> {
}
```

```typescript
@Injectable()
export class UserService extends ObjectionCrudService<User> {
  constructor(@Inject(User) userModel: typeof User) {
    super({ model: userModel });
  }
}
```

### Hooks

This project integrates [@feathersjs/hooks](https://github.com/feathersjs/hooks) with NestJS. It allows you to create composable and reusable workflows that can add:

* Logging
* Profiling
* Validation
* Caching/Debouncing
* Permissions
* Data pre- and postprocessing
* etc.

#### Examples

##### Basic example

```typescript
@Injectable()
export class LogRuntimeHook implements IHook<ExampleService> {
  async process(context: IHookContext<ExampleService>, next: NextFunction): Promise<void> {
    const start = new Date().getTime();
    await next();
    const end = new Date().getTime();
    console.log(`Function '${context.method}' returned '${context.result}' after ${end - start}ms`);
  }
}
```

```typescript
@Injectable()
export class ExampleService {
  @Hooks([LogRuntimeHook])
  sayHi(): string {
    return "Hi";
  }
}
```

#### Configurable Hook

```typescript
@Injectable()
export class ConfigurableHook implements IHook<ExampleService>, IConfigurable {
  private options: IOptions;

  async process(context: IHookContext<ExampleService>, next: NextFunction): Promise<void> {
    console.log(this.options);
    await next();
  }

  setOptions(options: IOptions): void {
    this.options = options;
  }
}
```

```typescript
@Injectable()
export class ExampleService {
  @Hooks([
    injectOptions(ConfigurableHook, { foo: "bar" }),
    injectOptions(ConfigurableHook, { baz: "qux" })
  ])
  sayHi() {
    return "Hi";
  }
}
```

#### Class decorator

```typescript
@Hooks<ExampleService>({
  sayHi: [LogRuntimeHook]
})
@Injectable()
export class ExampleService {
  sayHi() {
    return "Hi";
  }
}
```

#### Hooks with CRUD services

```typescript
@Hooks<UserService>(getCrudMap([
  // this hook will be applied to the "find", "get", "create", "update", "patch", "remove" methods
  UserAccessControlHook
]), {
  // this hook will only be applied to the "find" method
  find: [PopulateDataHook]
})
@Injectable()
export class UserService extends ObjectionCrudService<User> {
  constructor(@Inject(User) userModel: typeof User) {
    super({ model: userModel });
  }
}
```

### Swagger auto sign-in

You can use Swagger auto sign-in. Add this to your `.env` file:

```dotenv
SWAGGER_USER_AUTO_SIGN_IN=true
SWAGGER_USER_EMAIL=bob@mail.com
SWAGGER_USER_PASSWORD=secret
```

### Logger

```typescript
@Injectable()
export class UserService {
  protected readonly logger = new Logger(this.constructor.name);

  async findAll(): Promise<User[]> {
    this.logger.log("Getting users");
    // ...
  }
}
```

See [this answer](https://stackoverflow.com/a/52907695/11568610) for details.

### Migrations

See [the Knex docs](http://knexjs.org/#Migrations).

```bash
npm run db-migrate:make migration-name
npm run db-migrate:latest
# or without NPM
npx knex migrate:make migration-name
npx knex migrate:latest
npx knex migrate:rollback --all
```

### Seeding

```bash
npm run db-seeder:run
```

### TODO

1. Security https://docs.nestjs.com/techniques/security
2. Code generation. Use NestJS CLI with [a custom schematics collection](https://docs.nestjs.com/cli/usages#options): `--collection [collectionName]` 
3. Automated testing
4. Sign up
5. Password reset
6. Email confirmation
7. Improve logging
 