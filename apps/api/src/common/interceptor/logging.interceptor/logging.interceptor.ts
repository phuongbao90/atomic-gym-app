import { Injectable } from "@nestjs/common";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor {
  intercept(context, next) {
    console.log(
      ` Method: ${context.switchToHttp().getRequest()?.method}\n`,
      `URL: ${context.switchToHttp().getRequest()?.url}\n`,
      `IP: ${context.switchToHttp().getRequest()?.ip}\n`,
      `Body: ${(JSON.stringify(context.switchToHttp().getRequest()?.body), null, 2)}\n`,
      `Params: ${(JSON.stringify(context.switchToHttp().getRequest()?.params), null, 2)}\n`,
      `Query: ${(JSON.stringify(context.switchToHttp().getRequest()?.query), null, 2)}\n`,
      `Headers: ${JSON.stringify(context.switchToHttp().getRequest()?.headers, null, 2)}\n`,
      `Session: ${(JSON.stringify(context.switchToHttp().getRequest()?.session), null, 2)}`
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `~~~~ After... ${Date.now() - now}ms ~~~~\n----------------------------------------------------------`
          )
        )
      );
  }
}
