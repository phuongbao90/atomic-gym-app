import { ZodError } from "zod";

// sample error
// [
//     {
//       code: "invalid_type",
//       expected: "string",
//       received: "number",
//       path: ["names", 1],
//       message: "Invalid input: expected string, received number",
//     },
//     {
//       code: "unrecognized_keys",
//       keys: ["extra"],
//       path: ["address"],
//       message: "Unrecognized key(s) in object: 'extra'",
//     },
//     {
//       code: "too_small",
//       minimum: 10000,
//       type: "number",
//       inclusive: true,
//       path: ["address", "zipCode"],
//       message: "Value should be greater than or equal to 10000",
//     },
//   ];

export function extractZodErrors(error: ZodError | Error) {
  if (error instanceof ZodError) {
    if (error.errors.length === 0) {
      return "Unknown error";
    }
    const message = error.errors.reduce((acc, error) => {
      return (
        acc +
        error.path.join(".") +
        ": " +
        error.message +
        " => " +
        error.code +
        "\n"
      );
    }, "");
    return message;
  }
  return error.message;
}
