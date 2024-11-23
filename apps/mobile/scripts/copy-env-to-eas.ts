import fs from "fs";
import path from "path";
import dotenv from "dotenv";

interface EasBuildProfile {
  development?: {
    developmentClient?: boolean;
    distribution?: string;
    env?: Record<string, string>;
  };

  staging?: {
    distribution?: string;
    env?: Record<string, string>;
  };
  production?: {
    developmentClient?: boolean;
    distribution?: string;
    android?: {
      buildType?: string;
    };
    ios?: {
      image?: string;
    };
    env?: Record<string, string>;
  };
}

interface EasConfig {
  cli: {
    appVersionSource: string;
  };
  build: EasBuildProfile;
}

const APP_DIR = path.resolve(__dirname, "../..");
const EAS_JSON_PATH = path.join(APP_DIR, "eas.json");
const ENV_FILES: Record<keyof EasBuildProfile, string> = {
  development: path.join(APP_DIR, ".env.development"),
  staging: path.join(APP_DIR, ".env.staging"),
  production: path.join(APP_DIR, ".env.production"),
};

/**
 * Loads environment variables from a .env file.
 * @param envPath Path to the .env file.
 * @returns An object containing key-value pairs of environment variables.
 */
const loadEnvVariables = (envPath: string): Record<string, string> => {
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env file not found at path: ${envPath}`);
  }
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  return envConfig;
};

/**
 * Loads and parses the eas.json file.
 * @param easJsonPath Path to the eas.json file.
 * @returns The parsed EasConfig object.
 */
const loadEasConfig = (easJsonPath: string): EasConfig => {
  if (!fs.existsSync(easJsonPath)) {
    throw new Error(`eas.json file not found at path: ${easJsonPath}`);
  }
  const easJson = fs.readFileSync(easJsonPath, "utf-8");
  return JSON.parse(easJson) as EasConfig;
};

/**
 * Updates the env sections of each build profile in eas.json with the provided variables.
 * @param easConfig The current EasConfig object.
 * @param envVars The environment variables to inject.
 * @param profile The build profile to update.
 * @returns The updated EasConfig object.
 */
const updateEasConfigWithEnv = (
  easConfig: EasConfig,
  envVars: Record<string, string>,
  profile: keyof EasBuildProfile
): EasConfig => {
  if (!easConfig.build[profile]) {
    easConfig.build[profile] = { env: {} };
  }

  if (!easConfig.build[profile]?.env) {
    easConfig.build[profile]!.env = {};
  }

  easConfig.build[profile]!.env = {
    ...easConfig.build[profile]!.env,
    ...envVars,
  };

  return easConfig;
};

/**
 * Writes the updated EasConfig object back to eas.json.
 * @param easJsonPath Path to the eas.json file.
 * @param easConfig The updated EasConfig object.
 */
const writeEasConfig = (easJsonPath: string, easConfig: EasConfig): void => {
  const updatedEasJson = JSON.stringify(easConfig, null, 2);
  fs.writeFileSync(easJsonPath, updatedEasJson, "utf-8");
  console.log("✅ Successfully updated eas.json with environment variables.");
};

/**
 * Main function to orchestrate the copying of env variables to eas.json.
 */
const copyEnvToEas = (): void => {
  try {
    const easConfig = loadEasConfig(EAS_JSON_PATH);
    console.log("🚀 easConfig", ENV_FILES);
    Object.entries(ENV_FILES).forEach(([profile, envPath]) => {
      const envVars = loadEnvVariables(envPath);
      updateEasConfigWithEnv(
        easConfig,
        envVars,
        profile as keyof EasBuildProfile
      );
      console.log(`✅ Loaded environment variables for profile: ${profile}`);
    });

    writeEasConfig(EAS_JSON_PATH, easConfig);
  } catch (error) {
    console.error("❌ Error copying environment variables to eas.json:", error);
    process.exit(1);
  }
};

copyEnvToEas();
