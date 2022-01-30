import { FC } from "react";
import { IconContext } from "react-icons/lib";
import { AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { BsFillCaretDownFill } from "react-icons/bs";
import NavButton from "../common/NavButton";
import { useMediaQuery } from "react-responsive";
import Logo from "../common/Logo";
import SearchBar from "../SearchBar";

const NavBar: FC = () => {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const buttonStyle = { color: "#52525b", fontSize: "1.3rem" };
  if (isMobileScreen) {
    return (
      <header className=" bg-zinc-100 h-14 w-full flex items-center justify-between">
        <div className="h-full flex items-center mx-1">
          <Logo />
          <NavButton to="search">
            <AiOutlineSearch style={buttonStyle} />
          </NavButton>
        </div>
        <div className="h-full flex items-center mx-1">
          <NavButton to="friends">
            <HiUserGroup style={buttonStyle} />
          </NavButton>
          <NavButton to="profile">
            <HiUser style={buttonStyle} />
          </NavButton>
          <NavButton to="notifications">
            <AiFillBell style={buttonStyle} />
          </NavButton>
          <NavButton>
            <BsFillCaretDownFill style={buttonStyle} />
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
          <li>Home</li>
          <li>Friends</li>
        </ul>
        <div className="h-full flex items-center justify-end px-1 w-full">
          <span>Profile</span>
          <NavButton to="notifications">
            <AiFillBell style={buttonStyle} />
          </NavButton>

          <NavButton>
            <BsFillCaretDownFill style={buttonStyle} />
          </NavButton>
        </div>
      </header>
    );
  }
};

export default NavBar;
