import React, { ReactNode, FC } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  children: ReactNode;
  to?: string;
  className?: string;
};

const NavButton: FC<Props> = ({ children, to, className }) => {
  return (
    <NavLink
      to={to ? to : ""}
      className={({ isActive }) => {
        let styles = `h-[70%] aspect-square rounded-full bg-zinc-300 hover:bg-zinc-400 grid place-items-center mx-1 transition-all ${className}`;
        if (isActive) {
          styles = styles + " bg-zinc-400";
        }
        return styles;
      }}
    >
      {children}
    </NavLink>
  );
};

export default NavButton;
