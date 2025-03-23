type Success<T> = { data: T; error: null };
type Failure<E> = { data: null; error: E };
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * tryCatch - Error handling that can be synchronous or asynchronous
 * based on the input function.
 *
 * @param fn Function to execute.
 * @param operationName Optional name for context.
 * @returns A Result, or a Promise resolving to a Result, depending on fn.
 */
export function tryCatch<T>(
  fn: () => T,
  operationName?: string,
): Result<T, Error>;
export function tryCatch<T>(
  fn: () => Promise<T>,
  operationName?: string,
): Promise<Result<T, Error>>;
export function tryCatch<T>(
  fn: () => T | Promise<T>,
  operationName?: string,
): Result<T, Error> | Promise<Result<T, Error>> {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result
        .then((data) => ({ data, error: null }))
        .catch((rawError: unknown) => {
          const processedError =
            rawError instanceof Error ? rawError : new Error(String(rawError));

          if (operationName) {
            processedError.message = `Operation "${operationName}" failed: ${processedError.message}`;
          }
          return { data: null, error: processedError };
        });
    }

    // if success
    return { data: result, error: null };
  } catch (rawError: unknown) {
    const processedError =
      rawError instanceof Error ? rawError : new Error(String(rawError));

    if (operationName) {
      processedError.message = `Operation "${operationName}" failed: ${processedError.message}`;
    }
    return { data: null, error: processedError };
  }
}

/* -------------------------------------------------------------------------- */
/*                                  examples                                  */
/* -------------------------------------------------------------------------- */

function performDivision(numerator: number, denominator: number): void {
  const divisionResult = tryCatch<number>(() => {
    if (denominator === 0) {
      throw new Error("Cannot divide by zero!");
    }
    return numerator / denominator;
  }, "Division Operation");

  if (divisionResult.error) {
    console.error("Division failed:", divisionResult.error.message);
  } else {
    console.log("Division success:", divisionResult.data);
  }
}

async function delayedGreeting(
  name: string,
  shouldFail: boolean,
): Promise<void> {
  const greetingResult = await tryCatch<string>(
    () =>
      new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error("Greeting service unavailable!"));
          } else {
            resolve(`Hello, ${name}!`);
          }
        }, 500);
      }),
    "Greeting Task", // Operation Name for context
  );

  if (greetingResult.error) {
    console.error("Greeting failed:", greetingResult.error.message); // Access message directly (always Error)
  } else {
    console.log("Greeting success:", greetingResult.data);
    console.log("Greeting:", greetingResult.data);
  }
}

interface Person {
  name: string;
  age: number;
}

async function parseJsonString(jsonString: string): Promise<void> {
  console.log("--- JSON Parsing Example (Type-Safe) ---");
  const parsingResult = tryCatch<Person>(
    () => JSON.parse(jsonString) as Person,
    "JSON Parsing",
  );

  if (parsingResult.error) {
    console.error("JSON parsing failed:", parsingResult.error.message);
  } else {
    console.log("JSON parsing success:", parsingResult.data);
    console.log("Parsed JSON:", parsingResult.data);

    if (parsingResult.data) {
      console.log(
        `Name: ${parsingResult.data.name}, Age: ${parsingResult.data.age}`,
      );
    }
  }
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

async function fetchUserData(userId: number): Promise<void> {
  console.log("\n--- API Fetch Example (Type-Safe) ---");
  const fetchResult = await tryCatch<User>(async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as User;
  }, "Fetch User Data");

  if (fetchResult.error) {
    console.error("API fetch failed:", fetchResult.error.message);
  } else {
    console.log("API fetch success:", fetchResult.data);
    console.log("User Data:", fetchResult.data);

    if (fetchResult.data) {
      console.log(
        `User ID: ${fetchResult.data.id}, Name: ${fetchResult.data.name}, Email: ${fetchResult.data.email}`,
      );
    }
  }
}
