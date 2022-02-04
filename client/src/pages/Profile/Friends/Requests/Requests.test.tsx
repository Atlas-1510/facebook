import Requests from "./Requests";
import { AuthProvider } from "../../../../contexts/Auth";
import { QueryClientProvider, QueryClient } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import generateTestUsers from "../../../../utils/generateTestUsers";

const mockUsers = generateTestUsers();

describe("Requests", () => {
  let axiosMock: MockAdapter;
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock = new MockAdapter(axios);
  });

  function setup() {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter>
            <Requests />
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  test("Renders only contacts with active requests", async () => {
    axiosMock.onGet("/auth/getAuthStatus").reply(200, mockUsers[1]);
    mockUsers.forEach((user) => {
      axiosMock.onGet(`/api/users/${user._id}`).reply(200, user);
    });
    setup();

    expect(await screen.findByText("Peter Parker")).toBeInTheDocument();
    expect(await screen.findByText("Natasha Romanov")).toBeInTheDocument();
    expect(screen.queryByText("Steve Rogers")).not.toBeInTheDocument();
    expect(screen.queryByText("Bruce Banner")).not.toBeInTheDocument();
    expect(screen.queryByText("Nick Fury")).not.toBeInTheDocument();
  });
});
