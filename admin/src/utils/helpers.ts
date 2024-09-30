const __DEV__ = process.env.NODE_ENV === "development";

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
