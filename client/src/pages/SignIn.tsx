import { FC, useState, ChangeEvent, SyntheticEvent, useContext } from "react";
import GitHubLink from "../components/GitHubLink";
import axios from "axios";
import { AuthContext } from "../contexts/Auth";
import Modal from "../components/Modal";

const SignIn: FC = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e: SyntheticEvent): Promise<void> => {
    try {
      e.preventDefault();
      setFlash("");
      setLoading(true);

      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const { message, _id }: { message: string; _id: string } = response.data;
      if (message) {
        setFlash(message);
        setLoading(false);
      } else if (_id) {
        setUser(response.data);
      } else {
        throw new Error(
          "Login error, did not receive error message or successful login result"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-neutral-200">
      <main className="w-full flex flex-col md:flex-row items-center p-5 md:p-10 md:justify-around flex-grow max-w-6xl">
        <section className="flex flex-col items-center md:items-start max-w-sm md:max-w-md md:mr-4">
          <h1 className=" text-facebook-blue font-klavika text-6xl">
            odinbook
          </h1>
          <p className=" text-xl text-center md:text-left my-3 font-roboto">
            Odinbook helps you connect and share with the people in your life.
          </p>
        </section>

        <section className="bg-white rounded-lg w-full max-w-sm md:max-w-md shadow-lg flex flex-col items-center p-4">
          <form
            className="flex flex-col item-center w-full"
            onSubmit={handleFormSubmit}
          >
            <input
              className="input"
              aria-label="email"
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <input
              className="input my-3"
              aria-label="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              required
            />

            <button
              className=" bg-facebook-blue hover:bg-blue-600 text-white my-1 rounded font-roboto text-lg p-2  hover:shadow-inner"
              type="submit"
            >
              {loading ? "Loading" : "Log In"}
            </button>
          </form>
          <span className="my-2 text-red-500 text-sm">{flash}</span>
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
          <button
            onClick={() => setSignupOpen(true)}
            className=" bg-green-500 hover:bg-green-600 rounded font-roboto p-3 my-3 text-white hover:shadow-inner"
          >
            Create New Account
          </button>
        </section>
        <Modal open={signupOpen} onClose={() => setSignupOpen(false)}>
          Sign Up Modal Content
        </Modal>
      </main>

      <footer className="text-stone-500 text-center text-xs w-full flex flex-col items-center justify-end bg-white p-3">
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
