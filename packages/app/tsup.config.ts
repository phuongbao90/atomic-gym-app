import { dotenvLoad } from "dotenv-mono";
import { defineConfig } from "tsup";
dotenvLoad();

console.log("process.env", process.env.API_URL);

if (!process.env.API_URL) {
  throw new Error("API_URL not defined");
}
export default defineConfig({
  entry: ["./src/**/*.ts"],
  format: ["esm", "cjs"],
  // clean: true,
  dts: true,
  sourcemap: true,
  env: {
    API_URL: process.env.API_URL,
  },
});
