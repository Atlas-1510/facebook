import React, { FC, ReactNode, SyntheticEvent } from "react";

type Props = {
  onClick?:
    | ((e: SyntheticEvent) => Promise<void>)
    | ((e: SyntheticEvent) => void);
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  children: ReactNode;
};

const PrimaryButton: FC<Props> = ({ children, onClick, type, disabled }) => {
  return (
    <button
      className=" bg-facebook-blue hover:bg-blue-600 text-white my-1 rounded font-roboto text-lg p-2  hover:shadow-inner disabled:bg-gray-300 disabled:border-gray-600 disabled:text-gray-600 transition-all"
      type={type ? type : "submit"}
      disabled={disabled ? disabled : false}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
