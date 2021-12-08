// Put logic for expecting a 404 response here
import request from "supertest";
import app from "../app/app";

export default async function expect404(method: string, route: string) {
  test("returns 404 error for invalid route request", async () => {
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
    expect(response.statusCode).toBe(404);
  });
}
