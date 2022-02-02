import { FC, useContext, SyntheticEvent } from "react";
import { AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { BsFillCaretDownFill } from "react-icons/bs";
import NavButton from "./NavButton";
import { useMediaQuery } from "react-responsive";
import Logo from "./Logo";
import SearchBar from "../SearchBar";
import { AiFillHome } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import NavTab from "./NavTab";
import { AuthContext } from "../../contexts/Auth";
import UserThumbnail from "./UserThumbnail";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavBar: FC = () => {
  const { user, getUserState } = useContext(AuthContext);
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();

  const handleSignOut = async (e: SyntheticEvent): Promise<void> => {
    const response = await axios.get("/auth/logout");
    console.log(response);
    getUserState();
    navigate("/");
  };

  if (isMobileScreen) {
    return (
      <header className=" bg-zinc-100 h-14 w-full flex items-center justify-between shadow-md sticky top-0 mb-3">
        <div className="h-full flex items-center mx-1">
          <Logo />
          <NavButton to="search" className="text-zinc-600 text-xl">
            <AiOutlineSearch />
          </NavButton>
        </div>
        <div className="h-full flex items-center mx-1">
          <NavButton to="friends" className="text-zinc-600 text-xl">
            <HiUserGroup />
          </NavButton>
          <NavButton to="profile" className="text-zinc-600 text-xl">
            <HiUser />
          </NavButton>
          <NavButton to="notifications" className="text-zinc-600 text-xl">
            <AiFillBell />
          </NavButton>
          <NavButton to="options" className="text-zinc-600 text-xl">
            <BsFillCaretDownFill />
          </NavButton>
        </div>
      </header>
    );
  } else {
    return (
      <header className=" bg-zinc-100 h-14 w-full grid grid-cols-3 shadow-md  sticky top-0 z-10 mb-3">
        <div className="h-full flex items-center mx-1">
          <Logo />
          <SearchBar placeholder="Search Facebook" />
        </div>
        <ul className="h-full flex items-center justify-center mx-1 w-full">
          <NavTab to="" className="text-zinc-600 text-xl">
            <AiFillHome />
          </NavTab>
          <NavTab to="/profile/friends" className="text-zinc-600 text-xl">
            <HiUserGroup />
          </NavTab>
        </ul>
        <div className="h-full flex items-center justify-end px-1">
          <NavLink
            to="profile"
            className={({ isActive }) => {
              let styles =
                "h-[70%] overflow-hidden text-zinc-900 flex justify-center items-center m-2 hover:bg-slate-200 rounded-full transition-all";
              let activeStyles =
                "h-[70%] overflow-hidden flex justify-center items-center m-2 hover:bg-blue-200 rounded-full text-facebook-blue bg-blue-100 transition-all";
              return isActive ? activeStyles : styles;
            }}
          >
            <div className="h-8 pl-1">
              <UserThumbnail />
            </div>

            <span className=" font-roboto font-medium text-inherit  ml-2 pr-2">
              {user?.firstName}
            </span>
          </NavLink>
          <NavButton to="notifications" className="text-zinc-600 text-xl">
            <AiFillBell />
          </NavButton>
          <NavButton to="options" className="text-zinc-600 text-xl">
            <BsFillCaretDownFill />
          </NavButton>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </header>
    );
  }
};

export default NavBar;
