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
import { QueryClientProvider, QueryClient } from "react-query";

// TODO: Change package.json app dev rules back to true before deployment ("testing-library/no-debugging-utils")
// https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-debugging-utils.md

const queryClient = new QueryClient();

function setup() {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe("App test", () => {
  let axiosMock = new MockAdapter(axios);
  beforeEach(() => {
    jest.resetAllMocks();
    axiosMock.reset();
    queryClient.clear();
    axiosMock.onGet("/api/posts/newsfeed").reply(200, []);
  });
  test("Renders home page when user context available", async () => {
    const user = {
      _id: "some_id",
      firstName: "Jason",
      lastName: "Aravanis",
      email: "jason@aravanis.com",
    };
    axiosMock.onGet("/auth/getAuthStatus").replyOnce(200, user);
    setup();

    expect(await screen.findByText("Sign Out")).toBeInTheDocument();
  });

  test("Renders sign in page when user context not available", () => {
    axiosMock.onGet("/auth/getAuthStatus").replyOnce(200, null);
    setup();

    expect(
      screen.getByText(
        "Odinbook helps you connect and share with the people in your life."
      )
    ).toBeInTheDocument();
  });
  test("Redirects to home page after successful sign in", async () => {
    // 1) On app load, authStatus endpoint (mocked) returns null
    // 2) When signin POST request is made, mock data is returned (note: while user data is returned here it shouldn't be used
    //    to directly update auth state. The return result is just to get the error message if the signin attempt fails)
    // 3) react-query then launches a second request to mocked authStatus endpoint, and updates overall auth state
    // this is passed down via context, and causes signin page to be replaced with home page.
    axiosMock
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, null)
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, {
        firstName: "Jason",
        _id: "some_id",
      });

    axiosMock.onPost("/auth/login").replyOnce(200, {
      firstName: "Jason",
      _id: "some_id",
    });

    setup();

    userEvent.type(screen.getByLabelText("email"), "test@test.com");
    userEvent.type(screen.getByLabelText("password"), "test");
    userEvent.click(await screen.findByRole("button", { name: /log in/i }));
    await waitForElementToBeRemoved(() => screen.queryByText("Loading"));
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
  // TODO: Add tests for flash message display when login warning
  test("Click on 'Create New Account' button opens modal", async () => {
    axiosMock.onGet("/auth/getAuthStatus").replyOnce(200, null);
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
    axiosMock
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, null)
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, {
        firstName: "Jason",
        _id: "some_id",
      });
    axiosMock.onPost("/auth/signup").replyOnce(200, {
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
    expect(await screen.findByText("Sign Out")).toBeInTheDocument();
  });
  test("Shows flash message if problem with sign up", async () => {
    axiosMock.onGet("/auth/getAuthStatus").replyOnce(200, null);
    axiosMock.onPost("/auth/signup").replyOnce(200, {
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
