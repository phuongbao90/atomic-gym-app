import { dotenvLoad } from "dotenv-mono";
import { defineConfig } from "tsup";
dotenvLoad();

console.log("process.env", process.env.ENV);

if (!process.env.ENV) {
  throw new Error("ENV not defined");
}
export default defineConfig({
  entry: ["./src/**/*.ts"],
  format: ["esm", "cjs"],
  // clean: true,
  dts: true,
  sourcemap: true,
  env: {
    // API_URL: process.env.API_URL,
    ENV: process.env.ENV,
  },
  external: ["react", "react-native"],
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
    ".js": "jsx",
  },
});
