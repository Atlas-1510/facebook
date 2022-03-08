import axios from "axios";
import {
  SyntheticEvent,
  useEffect,
  useState,
  useRef,
  useContext,
  useMemo,
} from "react";
import { useMutation } from "react-query";

import PrimaryButton from "../../components/PrimaryButton";
import { AuthContext } from "../../contexts/Auth";
import defaultImage from "../../images/defaultUserPicture.jpeg";
import { User } from "../../types/User";

// TODO: Make sure user posts update name and profile image after a profile is edited.

type flashMessage = {
  type: "success" | "failure";
  message: string;
  payload?: User;
};

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const [triggerImageInput, setTriggerImageInput] = useState(false);
  const [image, setImage] = useState<any>(() => {
    if (!user || !user.displayPhoto) {
      return defaultImage;
    } else {
      return `/api/images/${user.displayPhoto}`;
    }
  });

  const imageInput = useRef<HTMLInputElement | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const initialAccountDetails = useMemo(
    () => ({
      firstName: user!.firstName,
      lastName: user!.lastName,
      email: user!.email,
      newPassword: "",
    }),
    [user]
  );
  const [accountDetails, setAccountDetails] = useState(initialAccountDetails);
  const [currentPassword, setCurrentPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState<flashMessage>({
    type: "success",
    message: "",
  });
  const handleChooseProfileButtonClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setTriggerImageInput(true);
  };

  useEffect(() => {
    if (triggerImageInput) {
      imageInput.current?.click();
      setTriggerImageInput(false);
    }
  }, [triggerImageInput]);

  useEffect(() => {
    if (
      JSON.stringify(accountDetails) !==
        JSON.stringify(initialAccountDetails) ||
      image !== null
    ) {
      setSubmitDisabled(currentPassword !== "" ? false : true);
    }
  }, [accountDetails, initialAccountDetails, currentPassword, image]);

  const handleImageSelection = () => {
    if (imageInput.current?.files) {
      const file = imageInput.current.files[0];
      if (!/image/i.test(file.type)) {
        alert("File " + file.name + " is not an image.");
        setImage(null);
        return;
      }
      setImage(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation(
    async () => {
      try {
        const formData: FormData = new FormData();
        formData.append("currentPassword", currentPassword);
        formData.append("firstName", accountDetails.firstName);
        formData.append("lastName", accountDetails.lastName);
        formData.append("email", accountDetails.email);
        if (accountDetails.newPassword) {
          formData.append("newPassword", accountDetails.newPassword);
        }
        if (image) {
          const blobbedImage = await fetch(image).then((r) => r.blob());
          formData.append("newProfileImage", blobbedImage);
        }

        const { data } = await axios.put(`/api/users/${user!._id}`, formData);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: (response: flashMessage) => {
        setFlashMessage({
          type: response.type,
          message: response.message,
        });
        setSubmitDisabled(true);
        setCurrentPassword("");
      },
      onError: (response: flashMessage) => {
        setFlashMessage({
          type: response.type,
          message: response.message,
        });
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <section className=" flex flex-col items-center w-full">
      <div className="relative rounded-full overflow-hidden h-20 md:h-36 aspect-square m-3">
        <img
          src={image}
          alt="chosen display for current user"
          className="w-full"
        />
        <input
          type="file"
          className="hidden"
          ref={imageInput}
          onChange={handleImageSelection}
          accept="image/*"
        ></input>
        <button
          className="absolute grid w-full h-full top-0 left-0 right-0 bottom-0 bg-black text-white 
                        opacity-0 hover:opacity-60 place-items-center transition-all"
          onClick={handleChooseProfileButtonClick}
        >
          <span className=" font-roboto">Change Image</span>
        </button>
      </div>
      <form className="flex flex-col item-center w-full">
        <div className="flex w-full">
          <div className="w-full">
            <label htmlFor="givenName" className="label">
              Given Name
            </label>
            <input
              id="givenName"
              className="input mb-3"
              name="first name"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              value={accountDetails.firstName}
              onChange={(e) =>
                setAccountDetails({
                  ...accountDetails,
                  firstName: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="familyName" className="label">
              Family Name
            </label>
            <input
              id="familyName"
              className="input mb-3"
              name="surname"
              type="text"
              placeholder="Surname"
              autoComplete="family-name"
              value={accountDetails.lastName}
              onChange={(e) =>
                setAccountDetails({
                  ...accountDetails,
                  lastName: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <label htmlFor="Email" className="label">
          Email
        </label>
        <input
          id="email"
          className="input mb-3"
          name="email"
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={accountDetails.email}
          onChange={(e) =>
            setAccountDetails({ ...accountDetails, email: e.target.value })
          }
          required
        />
        <label htmlFor="newPassword" className="label">
          New Password
        </label>
        <input
          id="newPassword"
          className="input mb-3"
          name="password"
          type="password"
          placeholder="New password"
          autoComplete="new-password"
          value={accountDetails.newPassword}
          onChange={(e) =>
            setAccountDetails({
              ...accountDetails,
              newPassword: e.target.value,
            })
          }
        />
        <div className="w-full my-3 h-px bg-gray-300 box-border"></div>
        <span className=" text-sm text-center m-1">
          Please enter your password to save your changes
        </span>
        <input
          aria-label="current password"
          className="input mb-3 bg-zinc-100"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <span
          className={`my-2 text-sm text-center ${
            flashMessage.type === "success"
              ? "text-emerald-500"
              : "text-red-500"
          }`}
        >
          {flashMessage.message}
        </span>
        <div className=" flex items-center justify-center space-x-3 m-3">
          <PrimaryButton onClick={handleSubmit} disabled={submitDisabled}>
            Save Changes
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;
