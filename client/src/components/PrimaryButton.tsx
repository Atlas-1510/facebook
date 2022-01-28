import React, { FC } from "react";

type Props = {
  title: string;
};

const PrimaryButton: FC<Props> = ({ title }) => {
  return (
    <button
      className=" bg-facebook-blue hover:bg-blue-600 text-white my-1 rounded font-roboto text-lg p-2  hover:shadow-inner"
      type="submit"
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
