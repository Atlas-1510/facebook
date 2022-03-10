import { Link } from "react-router-dom";
import fbLogo from "../../images/logo-facebook.svg";

const Logo = () => {
  return (
    <Link to="">
      <img src={fbLogo} alt="facebook logo" className="h-12 ml-1" />
    </Link>
  );
};

export default Logo;
