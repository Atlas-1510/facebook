import React, { FC, SyntheticEvent, useEffect, useState, useRef } from "react";
import SecondaryButton from "../../../components/common/SecondaryButton";
import testImage from "../../../images/test_profile_image.jpeg";

type Props = {
  setSection: React.Dispatch<React.SetStateAction<string>>;
};

const NameOrImage: FC<Props> = ({ setSection }) => {
  const [triggerImageInput, setTriggerImageInput] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const imageInput = useRef<HTMLInputElement | null>(null);

  // PROFILE IMAGE

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

  const handleImageSelection = () => {
    if (imageInput.current?.files) {
      const file = imageInput.current.files[0];
      if (!/image/i.test(file.type)) {
        alert("File " + file.name + " is not an image.");
        setImage(null);
        return;
      }
      setImage(file);
    }
  };

  return (
    <section>
      {/* Profile Image */}
      <div className="relative rounded-full overflow-hidden h-20 md:h-36 aspect-square">
        <img
          src={testImage}
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
      <div className=" flex items-center justify-center space-x-3 m-3">
        <SecondaryButton className=" bg-blue-500 text-zinc-50 hover:bg-facebook-blue">
          Save
        </SecondaryButton>
        <SecondaryButton>Return</SecondaryButton>
      </div>
    </section>
  );
};

export default NameOrImage;
