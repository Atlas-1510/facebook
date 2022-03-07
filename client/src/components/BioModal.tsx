import Modal from "./Modal";
import { FC, SyntheticEvent, useState } from "react";
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
  const queryClient = useQueryClient();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const mutation = useMutation(
    async () => {
      const formData: FormData = new FormData();
      formData.append("bio", bio);
      const { data } = await axios.put(`/api/users/${user!._id}`, formData);
      console.log(data);
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
        <PrimaryButton onClick={(e) => handleSubmit(e)}>
          <span>Submit</span>
        </PrimaryButton>
      </form>
    </Modal>
  );
};

export default BioModal;
