import { FC } from "react";
import { IconContext } from "react-icons/lib";
import { AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { BsFillCaretDownFill } from "react-icons/bs";
import NavButton from "../common/NavButton";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Logo from "../Logo";

const NavBar: FC = () => {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });
  if (isMobileScreen) {
    return (
      <header className=" bg-zinc-100 h-14 w-full flex items-center justify-between">
        <div className="h-full flex items-center mx-1">
          <Logo />
          <NavButton to="search">
            <IconContext.Provider value={{ color: "#52525b", size: "1.3rem" }}>
              <AiOutlineSearch />
            </IconContext.Provider>
          </NavButton>
        </div>
        <div className="h-full flex items-center mx-1">
          <NavButton to="friends">
            <IconContext.Provider value={{ color: "#27272a", size: "1.3rem" }}>
              <HiUserGroup />
            </IconContext.Provider>
          </NavButton>
          <NavButton to="profile">
            <IconContext.Provider value={{ color: "#27272a", size: "1.3rem" }}>
              <HiUser />
            </IconContext.Provider>
          </NavButton>
          <NavButton to="notifications">
            <IconContext.Provider value={{ color: "#27272a", size: "1.3rem" }}>
              <AiFillBell />
            </IconContext.Provider>
          </NavButton>
          <NavButton>
            <IconContext.Provider value={{ color: "#27272a", size: "1.3rem" }}>
              <BsFillCaretDownFill />
            </IconContext.Provider>
          </NavButton>
        </div>
      </header>
    );
  } else {
    return (
      <header className=" bg-zinc-100 h-14 w-full flex items-center justify-between">
        <Logo />
      </header>
    );
  }
};

export default NavBar;
