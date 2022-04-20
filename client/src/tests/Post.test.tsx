import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Post from "../components/Post/Post";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { QueryClientProvider, QueryClient } from "react-query";
import { PostInterface } from "../types/PostInterface";
import { AuthContext } from "../contexts/Auth";
import UserThumbnail from "../components/common/UserThumbnail";

import { User } from "../types/User";
import { CommentInterface } from "../types/CommentInterface";

const queryClient = new QueryClient();

// jest.doMock("../components/common/UserThumbnail", () => {
//   const UserThumbnailMock = () => <div />;
//   return UserThumbnailMock;
// });

jest.mock("../components/common/UserThumbnail", () => {
  const mockUserThumbnail = () => <div>MockUserThumbnail</div>;
  return mockUserThumbnail;
});

jest.mock("react-router-dom", () => ({
  Link: "div",
}));

const mockUser: User = {
  _id: "some_id",
  firstName: "Firsty",
  lastName: "Lasty",
  email: "first@last.com",
  displayPhoto: "some_photo",
  fullName: "Firsty Last",
  friends: [],
  inboundFriendRequests: [],
  outboundFriendRequests: [],
};

// mockPostId is defined seperately because it is used in both mockPost and mockComment,
// so needs to be defined before both mocks are initialised

const mockPostId = "some_post_id";

const mockComment: CommentInterface = {
  author: mockUser._id,
  content: "some comment",
  postID: mockPostId,
  createdAt: "some_createdAt",
  updatedAt: "some_updatedAt",
  _id: "some_comment_id",
};

const mockPost: PostInterface = {
  author: mockUser._id,
  content: "some_post_content",
  comments: [mockComment],
  likes: [],
  _id: mockPostId,
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
};

function setup() {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user: mockUser, getUserState: jest.fn() }}>
        <Post initialData={mockPost} />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe("Post.tsx", () => {
  let axiosMock = new MockAdapter(axios);
  beforeEach(() => {
    jest.resetAllMocks();
    axiosMock.reset();
    queryClient.clear();
    axiosMock.onGet("/auth/getAuthStatus").reply(200, mockUser);
    axiosMock.onGet(`/api/users/${mockPost.author}`).reply(200, mockUser);
    axiosMock.onGet(`/api/posts/${mockPost._id}`).reply(200, mockPost);
  });

  test("displays post author name", async () => {
    setup();
    const fullName = await screen.findByText(mockUser.fullName);
    expect(fullName).toBeInTheDocument();
  });

  test("displays post content", async () => {
    setup();
    const postContent = await screen.findByText(mockPost.content);
    expect(postContent).toBeInTheDocument();
  });

  test("shows added comments", async () => {
    setup();
    const commentContent = await screen.findByText(mockComment.content);
    expect(commentContent).toBeInTheDocument();
  });

  // test("updates like counter", async () => {
  //   setup()
  //   const likeButton = await screen.findByRole('button', { name: ""})
  // })
});
