import { FC, useState, SyntheticEvent, useContext } from "react";
import GitHubLink from "../components/GitHubLink";
import axios from "axios";
import { AuthContext } from "../contexts/Auth";
import Modal from "../components/Modal";
import PrimaryButton from "../components/PrimaryButton";
// import { Link } from "react-router-dom";

// TODO: Replace default browser outline on focus of inputs with standard one for all clients via tailwind (use 'ring' class)

const SignIn: FC = () => {
  const { getUserState } = useContext(AuthContext);
  // Signin form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState("");
  const [loading, setLoading] = useState(false);
  // Signup form state
  const [signupOpen, setSignupOpen] = useState(false);
  const [givenName, setGivenName] = useState("");
  const [surname, setSurname] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signinFlash, setSigninFlash] = useState("");

  const handleSigninSubmit = async (e: SyntheticEvent): Promise<void> => {
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
        await getUserState();
      } else {
        throw new Error(
          "Login error, did not receive error message or successful login result"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignUpSubmit = async (e: SyntheticEvent): Promise<void> => {
    try {
      e.preventDefault();
      setSigninFlash("");

      const response = await axios.post("/auth/signup", {
        firstName: givenName,
        lastName: surname,
        email: signupEmail,
        password: signupPassword,
      });

      const { message, _id }: { message: string; _id: string } = response.data;
      if (message) {
        setSigninFlash(message);
      } else if (_id) {
        getUserState();
      } else {
        throw new Error(
          "Login error, did not receive error message or successful login result"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = (e: SyntheticEvent) => {
    e.preventDefault();
    if (process.env.NODE_ENV === "development") {
      window.location.href = `${process.env.REACT_APP_BASE_URL}/auth/google`;
    } else {
      window.location.href = `/auth/google`;
    }
  };

  const handleTestDriveSignIn = async (e: SyntheticEvent): Promise<void> => {
    try {
      e.preventDefault();
      setFlash("");
      setLoading(true);

      const response = await axios.get("/auth/demoLogin");

      const { message, _id }: { message: string; _id: string } = response.data;
      if (message) {
        setFlash(message);
        setLoading(false);
      } else if (_id) {
        await getUserState();
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
            fakebook
          </h1>
          <p className=" text-xl text-center md:text-left my-3 font-roboto">
            Fakebook helps you connect and share with the people in your life.
          </p>
        </section>

        <section className="bg-white rounded-lg w-full max-w-sm md:max-w-md shadow-lg flex flex-col items-center p-4">
          <form
            className="flex flex-col item-center w-full"
            onSubmit={handleSigninSubmit}
          >
            <input
              className="input"
              aria-label="email"
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <input
              className="input my-3"
              aria-label="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* TODO: Implement password reset */}
          {/* <Link to="/passwordreset">
            <span className=" my-2 text-facebook-blue text-sm">
              Forgotten password?
            </span>
          </Link> */}

          <div className="flex w-full items-center">
            <div className="w-full ml-3 h-px bg-gray-300 box-border"></div>
            <span className="whitespace-nowrap mx-4 text-gray-800 text-sm">
              {" "}
              or{" "}
            </span>
            <div className="w-full mr-3 h-px bg-gray-300"></div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex">
              <button
                onClick={() => setSignupOpen(true)}
                className=" mx-1 bg-green-500 hover:bg-green-600 rounded font-roboto p-3 my-3 text-white hover:shadow-inner"
              >
                Create New Account
              </button>
              <button
                onClick={(e) => handleGoogleSignIn(e)}
                className=" m-1 bg-rose-400 hover:bg-rose-500 rounded font-roboto p-3 my-3 text-white hover:shadow-inner"
              >
                Sign In With Google
              </button>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={(e) => {
                  handleTestDriveSignIn(e);
                }}
                className=" m-1 bg-violet-400 hover:bg-violet-500 rounded font-roboto p-3 text-white hover:shadow-inner"
              >
                <span>Go for a test drive</span>
                <span className=" text-xl"> 🚗</span>
              </button>
            </div>
          </div>
        </section>
        <Modal
          open={signupOpen}
          onClose={() => setSignupOpen(false)}
          title="Sign Up"
          subtext="It's quick and easy."
        >
          <form className="flex flex-col item-center w-full">
            <input
              className="input mb-3"
              aria-label="first name"
              name="first name"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              required
              autoFocus
            />
            <input
              className="input mb-3"
              aria-label="Surname"
              name="surname"
              type="text"
              placeholder="Surname"
              autoComplete="family-name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <input
              className="input mb-3"
              aria-label="New email"
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <input
              className="input mb-3"
              aria-label="New password"
              name="password"
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <span className="my-2 text-red-500 text-sm">{signinFlash}</span>
            <PrimaryButton onClick={handleSignUpSubmit}>Sign Up</PrimaryButton>
          </form>
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
