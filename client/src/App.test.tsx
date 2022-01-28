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

    expect(
      await screen.findByText("This is the home page")
    ).toBeInTheDocument();
  });

  test("Renders sign in page when user context not available", () => {
    axiosMock.onGet("/auth/getAuthStatus").reply(200, null);
    setup();

    expect(
      screen.getByText(
        "Odinbook helps you connect and share with the people in your life."
      )
    ).toBeInTheDocument();
  });
  test("Redirects to home page after successful sign in", async () => {
    axiosMock
      .onGet("/auth/getAuthStatus")
      .reply(200, null)
      .onPost("/auth/login")
      .reply(200, {
        firstName: "Jason",
        _id: "some_id",
      });

    setup();

    userEvent.type(screen.getByLabelText("email"), "test@test.com");
    userEvent.type(screen.getByLabelText("password"), "test");
    userEvent.click(await screen.findByRole("button", { name: /log in/i }));
    await waitForElementToBeRemoved(() => screen.queryByText("Loading"));
    expect(screen.getByText("This is the home page")).toBeInTheDocument();
  });
  // TODO: Add tests for flash message display when login warning
  test("Click on 'Create New Account' button opens modal", async () => {
    setup();

    userEvent.click(
      await screen.findByRole("button", {
        name: /create new account/i,
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  // TODO: Add tests for behaviour when password is weak
  test("Successful signup redirects to home page", async () => {
    axiosMock.onPost("/auth/signup").reply(200, {
      firstName: "Jason",
      _id: "some_id",
    });
    setup();
    userEvent.click(
      await screen.findByRole("button", {
        name: /create new account/i,
      })
    );

    userEvent.type(await screen.findByLabelText("New email"), "test@test.com");
    userEvent.type(await screen.findByLabelText("New password"), "test");
    userEvent.click(await screen.findByRole("button", { name: "Sign Up" }));
    expect(
      await screen.findByText("This is the home page")
    ).toBeInTheDocument();
  });
  test("Shows flash message if problem with sign up", async () => {
    axiosMock.onPost("/auth/signup").reply(200, {
      message: "Mock flash warning",
    });
    setup();
    userEvent.click(
      await screen.findByRole("button", {
        name: /create new account/i,
      })
    );

    userEvent.type(await screen.findByLabelText("New email"), "test@test.com");
    userEvent.type(await screen.findByLabelText("New password"), "test");
    userEvent.click(await screen.findByRole("button", { name: "Sign Up" }));
    expect(await screen.findByText("Mock flash warning")).toBeInTheDocument();
  });
});
