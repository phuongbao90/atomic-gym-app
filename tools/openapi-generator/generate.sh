# https://openapi-generator.tech/docs/generators/typescript-nestjs/
npx openapi-generator-cli generate \
    -i ./openapi.json \
    --generator-name typescript-nestjs \
    -o ../../packages/app-config/src/generated-api \
    --skip-validate-spec


npx openapi-generator-cli generate \
    -i ./openapi.json \
    --generator-name typescript-axios \
    -o ../../packages/app-config/src/generated-api \
    --skip-validate-spec \

    

npx openapi-generator-cli generate \
  -c openapi-generator-config.yml \
  -o ../../packages/app-config/src/generated-api \
  --skip-validate-spec