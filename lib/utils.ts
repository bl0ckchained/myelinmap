// lib/utils.ts

/**
 * Tiny className combiner (clsx-lite).
 * Accepts strings, numbers, arrays, and object maps.
 * - falsy values (false/null/undefined/0/"") are ignored
 * - object keys are included when their value is truthy
 */
export type ClassPrimitive = string | number | null | false | undefined;
export type ClassDictionary = Record<string, ClassPrimitive | boolean>;
export type ClassInput = ClassPrimitive | ClassInput[] | ClassDictionary;

export function cn(...inputs: ClassInput[]): string {
  const out: string[] = [];

  const push = (val: ClassInput): void => {
    if (!val) return;

    if (typeof val === "string" || typeof val === "number") {
      if (val) out.push(String(val));
      return;
    }

    if (Array.isArray(val)) {
      for (const v of val) push(v);
      return;
    }

    if (typeof val === "object") {
      for (const key of Object.keys(val)) {
        // Include key when value is truthy
        if ((val as ClassDictionary)[key]) out.push(key);
      }
    }
  };

  for (const i of inputs) push(i);
  return out.join(" ");
}
// ensuring that the application can connect to the Supabase backend.
// It uses the `createClient` function from the Supabase JavaScript library to create a 
