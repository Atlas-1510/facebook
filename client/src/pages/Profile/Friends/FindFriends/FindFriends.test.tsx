import { render, screen } from "@testing-library/react";
import FindFriends from "./FindFriends";
import { QueryClientProvider, QueryClient } from "react-query";
import { AuthProvider } from "../../../../contexts/Auth";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import generateTestUsers from "../../../../utils/generateTestUsers";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const mockUsers = generateTestUsers();

// Tests are written from the point of view of mock user 1 (Tony).

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
    axiosMock.onGet("/auth/getAuthStatus").reply(200, mockUsers[1]);
    axiosMock.onGet("/api/users").reply(200, mockUsers);
    setup();
    expect(await screen.findByText("Steve Rogers")).toBeInTheDocument();
    expect(await screen.findByText("Peter Parker")).toBeInTheDocument();
    expect(await screen.findByText("Bruce Banner")).toBeInTheDocument();
    expect(await screen.findByText("Natasha Romanov")).toBeInTheDocument();
    // Logged in user shouldn't be displayed in a tile
    expect(screen.queryByText("Tony Stark")).not.toBeInTheDocument();
  });

  test("Clicking 'Remove' should change button label to 'Add Friend'", async () => {
    axiosMock
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, mockUsers[1])
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, { ...mockUsers[1], friends: [] });
    axiosMock
      .onGet("/api/users")
      .replyOnce(200, [mockUsers[3]])
      .onGet("/api/users")
      .replyOnce(200, [
        {
          ...mockUsers[3],
          friends: [],
        },
      ]);
    axiosMock.onDelete("/api/friendRequests/friends").reply(200);
    setup();
    const button = await screen.findByText("Remove");
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    expect(await screen.findByText("Add Friend")).toBeInTheDocument();
  });

  test("Clicking 'Add Friend' should change button label to 'Cancel Request'", async () => {
    axiosMock
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, mockUsers[1])
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, {
        ...mockUsers[1],
        outboundFriendRequests: [mockUsers[0]._id],
      });
    axiosMock
      .onGet("/api/users")
      .replyOnce(200, [mockUsers[0]])
      .onGet("/api/users")
      .replyOnce(200, [
        {
          ...mockUsers[0],
          inboundFriendRequests: [mockUsers[1]._id],
        },
      ]);
    axiosMock.onPost("/api/friendRequests").reply(200);
    setup();
    const button = await screen.findByText("Add Friend");
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    expect(await screen.findByText("Cancel Request")).toBeInTheDocument();
  });

  test("Clicking 'Cancel Request' should change button label to 'Add Friend'", async () => {
    axiosMock
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, mockUsers[1])
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, {
        ...mockUsers[1],
        outboundFriendRequests: [],
      });
    axiosMock
      .onGet("/api/users")
      .replyOnce(200, [mockUsers[4]])
      .onGet("/api/users")
      .replyOnce(200, [
        {
          ...mockUsers[4],
          inboundFriendRequests: [],
        },
      ]);
    axiosMock.onDelete("/api/friendRequests").reply(200);
    setup();
    const button = await screen.findByText("Cancel Request");
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    expect(await screen.findByText("Add Friend")).toBeInTheDocument();
  });

  test("Clicking 'Accept Request' should change button label to 'Remove'", async () => {
    axiosMock
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, mockUsers[1])
      .onGet("/auth/getAuthStatus")
      .replyOnce(200, {
        ...mockUsers[1],
        inboundFriendRequests: [],
        friends: [mockUsers[2]._id],
      });
    axiosMock
      .onGet("/api/users")
      .replyOnce(200, [mockUsers[2]])
      .onGet("/api/users")
      .replyOnce(200, [
        {
          ...mockUsers[2],
          outboundFriendRequests: [],
          friends: [mockUsers[1]._id],
        },
      ]);
    axiosMock.onPost("/api/friendRequests/handle").reply(200);
    setup();
    const button = await screen.findByText("Accept Request");
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    expect(await screen.findByText("Remove")).toBeInTheDocument();
  });
});
