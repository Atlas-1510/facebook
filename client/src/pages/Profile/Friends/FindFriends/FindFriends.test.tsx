import { render, screen, waitFor } from "@testing-library/react";
import FindFriends from "./FindFriends";
import { QueryClientProvider, QueryClient } from "react-query";
import { AuthProvider } from "../../../../contexts/Auth";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import generateTestUsers from "../../../../utils/generateTestUsers";
import { MemoryRouter } from "react-router-dom";

const mockUsers = generateTestUsers();

describe("FindFriends", () => {
  let axiosMock: MockAdapter;
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock = new MockAdapter(axios);
    jest.resetAllMocks();
  });

  function setup() {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter>
            <FindFriends />
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  test("Retrieves and shows contact names in tiles", async () => {
    const user = mockUsers[1];
    axiosMock.onGet("/auth/getAuthStatus").reply(200, user);
    axiosMock.onGet("/api/users").reply(200, mockUsers);
    setup();
    expect(await screen.findByText("Steve Rogers")).toBeInTheDocument();
    expect(await screen.findByText("Peter Parker")).toBeInTheDocument();
    expect(await screen.findByText("Bruce Banner")).toBeInTheDocument();
    expect(await screen.findByText("Natasha Romanov")).toBeInTheDocument();
    // Logged in user shouldn't be displayed in a tile
    expect(screen.queryByText("Tony Stark")).not.toBeInTheDocument();
  });

  //   test("Shows 'remove' button for friend tiles");

  //   test("Show 'Add Friend' button for non-friend tiles");

  //   test("Shows 'Cancel Request' button for contacts with active friend request");

  //   test(
  //     "Shows 'Accept Request' button for contacts with received active friend request"
  //   );
});
