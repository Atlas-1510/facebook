import React, { ReactNode, FC } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  to?: string;
};

const NavButton: FC<Props> = ({ children, to }) => {
  return (
    <Link to={to ? to : ""} className="h-full grid place-items-center">
      <div className=" h-[70%] aspect-square rounded-full bg-zinc-300 hover:bg-zinc-400 grid place-items-center mx-1 transition-all">
        {children}
      </div>
    </Link>
  );
};

export default NavButton;
