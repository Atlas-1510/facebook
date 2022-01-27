import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/Auth";
import Home from "./pages/Home";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// TODO: Change package.json app dev rules back to true before deployment ("testing-library/no-debugging-utils")
// https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-debugging-utils.md

function setup() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("App test", () => {
  let axiosMock = new MockAdapter(axios);
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Renders home page when user context available", async () => {
    const user = {
      _id: "some_id",
      firstName: "Jason",
      lastName: "Aravanis",
      email: "jason@aravanis.com",
    };
    axiosMock.onGet("/auth/getAuthStatus").reply(200, user);
    setup();
    const text = await screen.findByText("This is the home page");
    expect(text).toBeInTheDocument();
  });

  test("Renders sign in page when user context not available", () => {
    axiosMock.onGet("/auth/getAuthStatus").reply(200, null);
    setup();
    const text = screen.getByText(
      "Odinbook helps you connect and share with the people in your life."
    );
    expect(text).toBeInTheDocument();
  });
  test("Redirects to home page after successful sign in", async () => {
    axiosMock.onGet("/auth/getAuthStatus").reply(200, null);
    axiosMock.onPost("/auth/login").reply(200, {
      firstName: "Jason",
      _id: "some_id",
    });
    setup();
    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    userEvent.type(emailInput, "test@test.com");
    userEvent.type(passwordInput, "test");
    const submitButton = await screen.findByRole("button", { name: /log in/i });
    userEvent.click(submitButton);
    await waitForElementToBeRemoved(() => screen.queryByText("Loading"));
    expect(screen.getByText("This is the home page")).toBeInTheDocument();
  });
});
