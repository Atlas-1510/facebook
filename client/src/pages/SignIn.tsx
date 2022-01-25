import { FC } from "react";

const SignIn: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <main className="w-full flex flex-col items-center">
        <h1 className=" text-facebook-blue font-klavika text-2xl my-2">
          odinbook
        </h1>
        <form className="flex flex-col item-center  w-full">
          <input
            className="input"
            aria-label="email"
            name="email"
            type="email"
            placeholder="Email address"
          />
          <input
            className="input"
            aria-label="password"
            name="password"
            type="password"
            placeholder="Password"
          />
          <button
            className=" bg-facebook-blue text-white mx-3 my-1 rounded font-roboto text-lg p-1  hover:shadow-inner"
            type="submit"
          >
            Log In
          </button>
        </form>
        <span className=" my-2 text-facebook-blue text-sm">
          Forgotten password?
        </span>
      </main>
      <div className="flex w-full items-center">
        <div className="w-full ml-3 h-px bg-gray-300 box-border"></div>
        <span className="whitespace-nowrap mx-4 text-gray-800 text-sm">
          {" "}
          or{" "}
        </span>
        <div className="w-full mr-3 h-px bg-gray-300"></div>
      </div>
      <button className=" bg-[#00A400] rounded font-roboto p-1 px-3 my-3 text-white hover:shadow-inner">
        Create New Account
      </button>
      <footer className=" text-stone-500 text-center text-xs w-[75%] ">
        <span>
          This is a recreation of{" "}
          <a
            className="text-sky-400"
            href="https://about.facebook.com/meta/"
            target="_blank"
            rel="noreferrer"
          >
            facebook
          </a>
          , created as an assignment for
          <a
            className="text-sky-400"
            href="https://www.theodinproject.com"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            The Odin Project
          </a>
          .
        </span>
      </footer>
    </div>
  );
};

export default SignIn;
