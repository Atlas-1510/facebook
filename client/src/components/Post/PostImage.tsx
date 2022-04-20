import { FC } from "react";
import { TailSpin } from "react-loader-spinner";

interface Props {
  loading: boolean;
  error: boolean;
  success: boolean;
  data: string | undefined;
}

const PostImage: FC<Props> = ({ loading, error, success, data }) => {
  if (loading) {
    return (
      <div className=" flex justify-center items-center p-10">
        <TailSpin ariaLabel="loading" color="grey" />
      </div>
    );
  }
  if (error) {
    return <div>ERROR</div>;
  }
  if (success) {
    return <img src={data} alt="test post" className="w-full" />;
  }

  return null;
};

export default PostImage;
