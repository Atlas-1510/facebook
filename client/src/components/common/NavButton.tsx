import React, { ReactNode, FC } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  children: ReactNode;
  to?: string;
  className?: string;
};

const NavButton: FC<Props> = ({ children, to, className }) => {
  const styles = `h-[70%] aspect-square rounded-full bg-zinc-200 hover:bg-zinc-400 grid place-items-center mx-1 transition-all ${className}`;
  const activeStyles = styles + " bg-zinc-300";

  return (
    <NavLink
      to={to ? to : ""}
      className={({ isActive }) => (isActive ? activeStyles : styles)}
    >
      {children}
    </NavLink>
  );
};

export default NavButton;
