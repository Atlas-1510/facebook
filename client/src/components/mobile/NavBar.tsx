import { FC } from "react";
import { AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { BsFillCaretDownFill } from "react-icons/bs";
import NavButton from "../common/NavButton";
import { useMediaQuery } from "react-responsive";
import Logo from "../common/Logo";
import SearchBar from "../SearchBar";
import { AiFillHome } from "react-icons/ai";

const NavBar: FC = () => {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });
  if (isMobileScreen) {
    return (
      <header className=" bg-zinc-100 h-14 w-full flex items-center justify-between">
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
          <NavButton className="text-zinc-600 text-xl">
            <BsFillCaretDownFill />
          </NavButton>
        </div>
      </header>
    );
  } else {
    return (
      <header className=" bg-zinc-100 h-14 w-full grid grid-cols-3">
        <div className="h-full flex items-center mx-1 w-full">
          <Logo />
          <SearchBar />
        </div>
        <ul className="h-full flex items-center justify-center mx-1 w-full">
          <li className=" text-red-500">
            <AiFillHome />
          </li>
          <li>Friends</li>
        </ul>
        <div className="h-full flex items-center justify-end px-1 w-full">
          <span>Profile</span>
          <NavButton to="notifications" className="text-zinc-600 text-xl">
            <AiFillBell />
          </NavButton>

          <NavButton className="text-zinc-600 text-xl">
            <BsFillCaretDownFill />
          </NavButton>
        </div>
      </header>
    );
  }
};

export default NavBar;
