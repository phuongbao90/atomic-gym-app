import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { HashingProvider } from "./hashing.provider";

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async comparePassword(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
