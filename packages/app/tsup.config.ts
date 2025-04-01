import { dotenvLoad } from "dotenv-mono"
import { defineConfig } from "tsup"
dotenvLoad()

const envs = ["development", "staging", "production"]

if (
  !process.env.EXPO_PUBLIC_NODE_ENV ||
  !envs.includes(process.env.EXPO_PUBLIC_NODE_ENV)
) {
  throw new Error("EXPO_PUBLIC_NODE_ENV is not set or invalid")
}

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  outDir: "build",
  dts: false,
  sourcemap: true,
  env: {
    EXPO_PUBLIC_NODE_ENV: process.env.EXPO_PUBLIC_NODE_ENV,
  },
  external: ["react", "react-native"],
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
    ".js": "jsx",
  },
})
