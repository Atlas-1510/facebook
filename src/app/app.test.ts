import app from "./app";

describe("is working", () => {
  it("should work", () => {
    expect(true).toBeTruthy();
  });
});

describe("app", () => {
  it("returns 5", () => {
    expect(app()).toBe(5);
  });
});
