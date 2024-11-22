### config

- What is the requirement for using config? -> @nestjs/config
- How to create local / global config?
- what is the purpose of registerAs? is it necessary? what is it purpose?

### abstract class (hashing provider)

- What is the purpose of abstract class? -> blueprint for other classes (i.e. BcryptProvider)
- How to implement abstract class?
  - providers: [{ provide: HashingProvider, useClass: BcryptProvider }],
- What is the benefit of using abstract class?
  - easy swapping between different implementations (i.e. bcrypt -> scrypt)

### ForFeature vs ForRoot

(https://gist.github.com/darwinsubramaniam/f0ee125e0cee21ba787cc93c60272c79)

- What is the purpose of forFeature?
  - register configuration for a specific module (AuthModule)
- What is the purpose of forRoot?

  - register configuration for the root module (AppModule) -> global configuration -> available in all modules

```text
        0
    1       2
  3   4   5   6
```

if I do forRoot(databaseConfig) on module 1 then 1, 3, 4 can use databaseConfig
if I do forFeature(databaseConfig) on module 1 then only 1 can use the databaseConfig
if I do forRoot(databaseConfig) on module 0 then all can use the databaseConfig

### Guards vs Middleware

- middleware is dumb -> do not know about latter context
  ok for authentication, attaching properties to request object
  execute before guards, interceptors, pipes

- guards are smart -> know about latter context
  can make decision based on latter context
  ok for authorization, exception filters, pipes, interceptors
  execute after middleware and before any interceptor, pipe

### Guards

- very guard must implement a canActivate() function
- canActivate() function must return true or false
- can be scoped to the route, controller, or globally (like pipe, exception filter)
- use @UseGuards() decorator to attach guard to the route, controller, or globally
- setup Auth decorator and apply it to the controller or route

#### JWT Guard

- why JwtModule.registerAsync(jwtConfig.asProvider()) is required in multiple (App and Auth) modules? I thought it is already registered in App module?

  - because JWT is used in Auth module
  - if you dont want to import JWT in every module, you can include JwtModule.registerAsync(jwtConfig.asProvider()) in Common module (it is @Global())

- why auth guard is not working?
  - check the default auth type in auth.guard.ts (it is AuthType.Bearer)
  - check the Auth decorator in auth.controller.ts (it is @Auth(AuthType.None))

### Pipes

### Interceptors (i.e. transform response)

- interceptors are some kind of providers -> include @Injectable() decorator
- interceptors are executed before and after the controller method
- how to use interceptor?
  - create interceptor -> transform-response.interceptor.ts
  - register interceptor -> app.module.ts

### Decorator

- what is the purpose of decorator?
  - add additional information to the class, method, or property
