import { FC, useContext } from "react";
import { AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { BsFillCaretDownFill } from "react-icons/bs";
import NavButton from "./NavButton";
import { useMediaQuery } from "react-responsive";
import Logo from "./Logo";
import SearchBar from "../SearchBar";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import NavTab from "./NavTab";
import { AuthContext } from "../../contexts/Auth";
import UserThumbnail from "./UserThumbnail";

const NavBar: FC = () => {
  const { user } = useContext(AuthContext);
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });
  if (isMobileScreen) {
    return (
      <header className=" bg-zinc-100 h-14 w-full flex items-center justify-between shadow-md fixed">
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
      <header className=" bg-zinc-100 h-14 w-full grid grid-cols-3 shadow-md fixed">
        <div className="h-full flex items-center mx-1">
          <Logo />
          <SearchBar />
        </div>
        <ul className="h-full flex items-center justify-center mx-1 w-full">
          <NavTab to="" className="text-zinc-600 text-xl">
            <AiFillHome />
          </NavTab>
          <NavTab to="friends" className="text-zinc-600 text-xl">
            <HiUserGroup />
          </NavTab>
        </ul>
        <div className="h-full flex items-center justify-end px-1">
          <Link
            to="profile"
            className="h-full overflow-hidden flex justify-center items-center m-2"
          >
            <div className="h-8">
              <UserThumbnail />
            </div>

            <span className=" font-roboto font-medium text-zinc-900 ml-2">
              {user?.firstName}
            </span>
          </Link>
          <NavButton to="notifications" className="text-zinc-600 text-xl">
            <AiFillBell />
          </NavButton>
          <NavButton to="options" className="text-zinc-600 text-xl">
            <BsFillCaretDownFill />
          </NavButton>
        </div>
      </header>
    );
  }
};

export default NavBar;
