export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDistinct(): R; // This is used to add the custom jest matcher .toBeDistinct() to typescript
    }
  }
}
