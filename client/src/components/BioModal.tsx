import Modal from "./Modal";
import { FC, SyntheticEvent, useState, useEffect } from "react";
import PrimaryButton from "./PrimaryButton";
import { User } from "../types/User";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
};

const BioModal: FC<Props> = ({ open, onClose, user }) => {
  const [bio, setBio] = useState(user.bio ? user.bio : "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    setSubmitDisabled(currentPassword !== "" ? false : true);
  }, [currentPassword]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const mutation = useMutation(
    async () => {
      const formData: FormData = new FormData();
      formData.append("bio", bio);
      formData.append("currentPassword", currentPassword);
      await axios.put(`/api/users/${user!._id}`, formData);
    },
    {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries("userState");
      },
    }
  );
  return (
    <Modal open={open} onClose={onClose}>
      <form className="flex flex-col w-full">
        <label htmlFor="Email" className="label">
          Your bio
        </label>
        <textarea
          id="email"
          className="input mb-3 h-52 w-full"
          name="email"
          onChange={(e) => setBio(e.target.value)}
          required
          value={bio}
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
        <PrimaryButton
          onClick={(e) => handleSubmit(e)}
          disabled={submitDisabled}
        >
          <span>Submit</span>
        </PrimaryButton>
      </form>
    </Modal>
  );
};

export default BioModal;
