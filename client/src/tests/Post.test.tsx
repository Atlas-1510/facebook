import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Post from "../components/Post/Post";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { QueryClientProvider, QueryClient } from "react-query";
import { PostInterface } from "../types/PostInterface";
import { AuthProvider } from "../contexts/Auth";

const queryClient = new QueryClient();

const mockUser = {
  _id: "some_id",
  firstName: "Firsty",
  lastName: "Lasty",
  email: "first@last.com",
};

const mockPost: PostInterface = {
  author: "some_author_id",
  content: "some_post_content",
  comments: [],
  likes: [],
  _id: "some_post_id",
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
};

const mockPostWithAuthorLike: PostInterface = {
  ...mockPost,
  likes: [mockPost.author, ...mockPost.likes],
};

function setup() {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Post initialData={mockPost} />
      </AuthProvider>
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
    axiosMock.onGet(`/api/users/${mockPost.author}`).reply(200, {
      fullName: "Some Full Name",
    });
    axiosMock.onGet(`/api/posts/${mockPost._id}`).replyOnce(200, mockPost);
  });

  test("Shows 'liked' when like button is clicked", async () => {
    // mock a post before and after being liked.
    axiosMock
      .onPost(`/api/posts/${mockPost._id}/likes`)
      .reply(200, mockPostWithAuthorLike)
      .onGet(`/api/posts/${mockPost._id}`)
      .replyOnce(200, mockPostWithAuthorLike);
    setup();
    const likeButton = await screen.findByText("Like");
    expect(likeButton).toBeInTheDocument();
    userEvent.click(likeButton);
    expect(await screen.findByText("Liked!")).toBeInTheDocument();
  });
});
