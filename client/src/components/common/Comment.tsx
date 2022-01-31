import testPageImage from "../../images/test_page.jpeg";

const Comment = () => {
  return (
    <article className="flex">
      <img
        src={testPageImage}
        alt="test"
        className="rounded-full h-10 aspect-square inline-block mr-2"
      />
      <div className=" bg-zinc-200 rounded-2xl p-3">
        <h3 className=" font-medium">Comment Author</h3>
        <p>
          Comment content goes here. This is a very long comment which should
          wrap around. I am writing more content here. This is a very long
          comment which should wrap around.
        </p>
      </div>
    </article>
  );
};

export default Comment;
