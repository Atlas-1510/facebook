import React, { FC, SyntheticEvent } from "react";

type Props = {
  title: string;
  onClick?: (e: SyntheticEvent) => Promise<void>;
};

const PrimaryButton: FC<Props> = ({ title, onClick }) => {
  return (
    <button
      className=" bg-facebook-blue hover:bg-blue-600 text-white my-1 rounded font-roboto text-lg p-2  hover:shadow-inner"
      type="submit"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
