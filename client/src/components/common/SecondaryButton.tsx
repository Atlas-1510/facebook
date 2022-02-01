import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const SecondaryButton: FC<Props> = ({ children, className }) => {
  return (
    <button
      className={`bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center px-2 py-1 rounded-md text-zinc-700 font-medium text-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
