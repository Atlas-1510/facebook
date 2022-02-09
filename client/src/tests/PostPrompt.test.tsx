import PostPrompt from "../components/common/PostPrompt";
import { AuthProvider } from "../contexts/Auth";
import { QueryClientProvider, QueryClient } from "react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const mockUser = {
  _id: "some_id",
  firstName: "Firsty",
  lastName: "Lasty",
  email: "first@last.com",
};

function setup() {
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PostPrompt />
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe("PostPrompt", () => {
  let axiosMock = new MockAdapter(axios);
  beforeEach(() => {
    jest.resetAllMocks();
    axiosMock.reset();
    queryClient.clear();
    axiosMock.onGet("/auth/getAuthStatus").reply(200, mockUser);
  });
  test("Modal renders with prompt including user's first name", async () => {
    setup();
    const input = await screen.findByText(
      `What's on your mind, ${mockUser.firstName}?`
    );
    expect(input).toBeInTheDocument();
  });
  describe("With modal open", () => {
    let postButton: Element;
    let textInput: Element;
    let imageInput: Element;
    let mockFile = new File(["(⌐□_□)"], "chucknorris.png", {
      type: "image/png",
    });
    global.URL.createObjectURL = jest.fn();
    beforeEach(async () => {
      setup();
      const input = await screen.findByText(
        `What's on your mind, ${mockUser.firstName}?`
      );
      userEvent.click(input);
      postButton = await screen.findByRole("button", { name: "Post" });
      textInput = await screen.findByRole("textbox");
      imageInput = await screen.findByTestId("image-input");
    });

    test("'Post' button should be disabled until text is entered", async () => {
      expect(postButton).toBeDisabled();
      userEvent.type(textInput, "some content");
      expect(postButton).not.toBeDisabled();
    });
    test("'Post' button should be enabled if an image is selected", async () => {
      fireEvent.change(imageInput, { target: { files: [mockFile] } });
      expect(postButton).not.toBeDisabled();
    });
  });
});
