import { FC } from "react";

const SignIn: FC = () => {
  return (
    <>
      <main className="flex flex-col items-center ">
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
          <button type="submit">Log In</button>
        </form>
      </main>
      <footer>Footer</footer>
    </>
  );
};

export default SignIn;
