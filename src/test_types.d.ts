import { jest } from '@jest/globals';

// This utility type maps over each property in T. If it's a function, it wraps it with jest.MockedFunction.
// Otherwise, it leaves the property as it is.
type JestMocked<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? jest.MockedFunction<T[P]> : T[P];
};
