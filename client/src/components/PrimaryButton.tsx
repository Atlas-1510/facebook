import React, { FC, SyntheticEvent } from "react";

type Props = {
  title: string;
  onClick?: (e: SyntheticEvent) => Promise<void>;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
};

const PrimaryButton: FC<Props> = ({ title, onClick, type, disabled }) => {
  return (
    <button
      className=" bg-facebook-blue hover:bg-blue-600 text-white my-1 rounded font-roboto text-lg p-2  hover:shadow-inner disabled:bg-gray-300 disabled:border-gray-600 disabled:text-gray-600 transition-all"
      type={type ? type : "submit"}
      disabled={disabled ? disabled : false}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
