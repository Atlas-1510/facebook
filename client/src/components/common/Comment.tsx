import testPageImage from "../../images/test_page.jpeg";
import { FC } from "react";
import { CommentInterface } from "../../types/CommentInterface";
import { useQuery } from "react-query";
import axios from "axios";
import defaultUserPicture from "../../images/defaultUserPicture.jpeg";

type Props = {
  comment: CommentInterface;
};

const Comment: FC<Props> = ({ comment }) => {
  const { data: author, status: authorStatus } = useQuery(
    `commentAuthor: ${comment.author}`,
    async () => {
      try {
        const { data } = await axios.get(`/api/users/${comment.author}`);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      enabled: !!comment?._id,
    }
  );
  if (authorStatus === "loading") {
    return <div></div>;
  }
  if (authorStatus === "error") {
    return <div>Error retrieving comment author</div>;
  } else
    return (
      <article className="flex">
        <div className="rounded-full h-10 aspect-square mr-2 grid place-items-center overflow-hidden">
          <img
            src={
              author.displayPhoto
                ? `/api/images/${author.displayPhoto}`
                : defaultUserPicture
            }
            alt="test"
            className=""
          />
        </div>

        <div className=" bg-zinc-200 rounded-2xl p-3">
          <h3 className=" font-medium">{author.fullName}</h3>
          <p>{comment.content}</p>
        </div>
      </article>
    );
};

export default Comment;
