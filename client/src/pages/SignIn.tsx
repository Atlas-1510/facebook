import { FC } from "react";
import GitHubLink from "../components/GitHubLink";

const SignIn: FC = () => {
  return (
    <div className="flex flex-col items-center bg-neutral-200 h-screen">
      <main className="w-full flex flex-col items-center  p-5">
        <h1 className=" text-facebook-blue font-klavika text-6xl">odinbook</h1>
        <p className=" text-xl text-center my-3 font-roboto">
          Odinbook helps you connect and share with the people in your life.
        </p>
        <div className="bg-white rounded-lg w-full shadow-lg flex flex-col items-center p-4">
          <form className="flex flex-col item-center w-full">
            <input
              className="input"
              aria-label="email"
              name="email"
              type="email"
              placeholder="Email address"
            />
            <input
              className="input my-3"
              aria-label="password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <button
              className=" bg-facebook-blue text-white my-1 rounded font-roboto text-lg p-2  hover:shadow-inner"
              type="submit"
            >
              Log In
            </button>
          </form>
          <span className=" my-2 text-facebook-blue text-sm">
            Forgotten password?
          </span>
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
        </div>
      </main>

      <footer className="text-stone-500 text-center text-xs w-[75%] flex-grow flex flex-col items-center justify-end">
        <span>
          This is a recreation of{" "}
          <a
            className="text-sky-400"
            href="https://about.facebook.com/meta/"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
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
        <div className="flex items-center justify-center py-5">
          <GitHubLink />
        </div>
      </footer>
    </div>
  );
};

export default SignIn;
