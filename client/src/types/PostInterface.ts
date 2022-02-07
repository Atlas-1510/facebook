export interface PostInterface {
  author: string;
  content: string;
  comments: [];
  likes: [];
  createdAt: string;
  updatedAt: string;
  _id: string;
  authorProfilePhoto?: string;
  image?: string;
}
