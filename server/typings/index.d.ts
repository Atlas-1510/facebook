export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDistinct(): R; // This is used to add the custom jest matcher .toBeDistinct() to typescript in friendRequests.integration.test.ts
      toContainObject(object: any): R; // This is used to add the custom jest matcher .toContainObject() to typescript in auth.integration.test.ts
    }
  }
}
