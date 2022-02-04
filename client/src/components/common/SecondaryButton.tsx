import { FC, ReactNode, SyntheticEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: (e: SyntheticEvent) => Promise<void>;
};

const SecondaryButton: FC<Props> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={` flex items-center justify-center px-2 py-1 rounded-md  font-medium text-sm ${
        className ? className : "bg-zinc-200 hover:bg-zinc-300 text-zinc-700"
      }`}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
