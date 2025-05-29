import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, params, query, body } = request;
    const now = Date.now();

    this.logger.log(
      `Incoming Request:
      Method: ${method}
      URL: ${url}
      Params: ${JSON.stringify(params)}
      Query: ${JSON.stringify(query)}
      Body: ${JSON.stringify(body)}`
    );

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `Request completed - ${method} ${url} - ${responseTime}ms`
        );
      })
    );
  }
}
