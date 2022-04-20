import { CommentInterface } from "./CommentInterface";

export interface PostInterface {
  author: string;
  content: string;
  comments: CommentInterface[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
  _id: string;
  authorProfilePhoto?: string;
  image?: string;
}
