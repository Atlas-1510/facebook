import { FC } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  title: string;
  to: string;
  end?: boolean;
};

const ProfileTab: FC<Props> = ({ title, to, end }) => {
  const styles = `px-3 py-2 font-medium text-zinc-500 border-b-transparent border-b-4 transition-all`;
  const activeStyles =
    styles + " text-facebook-blue border-b-facebook-blue border-b-2";

  return (
    <NavLink
      end={end ? end : false}
      to={to}
      className={({ isActive }) => (isActive ? activeStyles : styles)}
    >
      <li>{title}</li>
    </NavLink>
  );
};

export default ProfileTab;
