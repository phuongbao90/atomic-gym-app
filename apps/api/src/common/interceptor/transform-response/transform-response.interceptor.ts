import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map, Observable } from "rxjs";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data.meta) {
          return {
            data: data.data,
            meta: data.meta,
            version: this.configService.get("env.API_VERSION"),
          };
        }
        return {
          data,
          version: this.configService.get("env.API_VERSION"),
        };
      })
    );
  }
}
