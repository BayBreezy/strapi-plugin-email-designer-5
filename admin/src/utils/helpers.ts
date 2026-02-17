/** Flag indicating if the application is running in development mode */
const __DEV__ = process.env.NODE_ENV === "development";

/**
 * Perform a shallow equality comparison between two objects
 *
 * Compares two objects by checking if they have the same number of keys
 * and if all corresponding values are strictly equal. Does not perform
 * deep comparison of nested objects. In development mode, logs differences
 * to the console for debugging.
 *
 * @param {any} object1 - The first object to compare
 * @param {any} object2 - The second object to compare
 * @returns {boolean} True if objects are shallowly equal, false otherwise
 *
 * @example
 * const obj1 = { name: "John", age: 30 };
 * const obj2 = { name: "John", age: 30 };
 * shallowIsEqual(obj1, obj2); // true
 *
 * @example
 * const obj1 = { name: "John", age: 30 };
 * const obj2 = { name: "John", age: 31 };
 * shallowIsEqual(obj1, obj2); // false (logs difference in dev mode)
 *
 * @example
 * // Shallow comparison - nested objects are compared by reference
 * const obj1 = { user: { name: "John" } };
 * const obj2 = { user: { name: "John" } };
 * shallowIsEqual(obj1, obj2); // false (different object references)
 */
export function shallowIsEqual(object1: any, object2: any) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    if (__DEV__) console.log("shallowIsEqual: keys1.length !== keys2.length");
    return false;
  }
  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      if (__DEV__) console.log(`shallowIsEqual: ${key}`, object1[key], " !== ", object2[key]);
      return false;
    }
  }

  return true;
}
