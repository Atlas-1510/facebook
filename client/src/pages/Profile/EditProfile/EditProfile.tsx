import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/Auth";
import NameOrImage from "./NameOrImage";
// import Email from "./Email";
// import Password from "./Password";
// import DeleteAccount from "./DeleteAccount";

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const [section, setSection] = useState("nameAndImage");

  return (
    <div>
      {section === "nameAndImage" && <NameOrImage setSection={setSection} />}
      {/* {section === "email" && <Email setSection={setSection} />} */}
      {/* {section === "password" && <Password setSection={setSection} />} */}
      {/* {section === "deleteAccount" && <DeleteAccount setSection={setSection} />} */}
    </div>
  );
};

export default EditProfile;
