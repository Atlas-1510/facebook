import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="" className="h-full grid place-items-center">
      <div className=" h-[70%] aspect-square  rounded-full mx-1 bg-gradient-to-t from-blue-700 to-blue-400 flex flex-col justify-center items-center overflow-hidden">
        <span className="font-klavika text-white text-5xl translate-y-2">
          f
        </span>
      </div>
    </Link>
  );
};

export default Logo;
