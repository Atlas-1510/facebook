import request from "supertest";
import app from "../app/app";

export default async function expectErrorCode(
  testDescription: string,
  method: string,
  route: string,
  statusCode: number
) {
  test(testDescription, async () => {
    let fn;

    switch (method) {
      case "get":
        fn = async () => request(app).get(route);
        break;
      case "post":
        fn = async () => request(app).post(route);
        break;
      case "put":
        fn = async () => request(app).put(route);
        break;
      case "delete":
        fn = async () => request(app).delete(route);
        break;
      default:
        throw new Error("invalid method for expect404()");
    }
    const response = await fn();
    expect(response.statusCode).toBe(statusCode);
  });
}
