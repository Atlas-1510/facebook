import AllFriends from "./AllFriends";
import { AuthProvider } from "../../../../contexts/Auth";
import { QueryClientProvider, QueryClient } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import generateTestUsers from "../../../../utils/generateTestUsers";
import { screen, render } from "@testing-library/react";

const mockUsers = generateTestUsers();

describe("AllFriends", () => {
  let axiosMock: MockAdapter;
  let queryClient: QueryClient;
  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    queryClient = new QueryClient();
  });
  function setup() {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <AllFriends />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  test("Shows friends of current user", async () => {
    axiosMock.onGet("/auth/getAuthStatus").reply(200, mockUsers[1]);
    axiosMock
      .onGet(`/api/users/${mockUsers[3]._id}`)
      .replyOnce(200, mockUsers[3]);
    axiosMock
      .onGet(`/api/users/${mockUsers[5]._id}`)
      .replyOnce(200, mockUsers[5]);
    setup();
    expect(await screen.findByText("Bruce Banner")).toBeInTheDocument();
    expect(await screen.findByText("Nick Fury")).toBeInTheDocument();
  });
});
