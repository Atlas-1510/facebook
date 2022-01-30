import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  children: ReactNode;
  to: string;
  className?: string;
};

const NavTab: FC<Props> = ({ children, to, className }) => {
  const styles = `text-2xl h-full grid place-items-center px-10 border-b-transparent border-b-4 ${className} transition-all`;
  const activeStyles =
    "text-facebook-blue text-2xl h-full grid place-items-center px-10 border-b-facebook-blue border-b-4 transition-all";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? activeStyles : styles)}
    >
      <li>{children}</li>
    </NavLink>
  );
};
export default NavTab;
