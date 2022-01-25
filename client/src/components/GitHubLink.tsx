import React from "react";
import { IconContext } from "react-icons";
import { SiGithub } from "react-icons/si";
import { Link } from "react-router-dom";

function GitHubLink() {
  return (
    <div className="flex items-center justify-center py-5">
      <Link
        to={{ pathname: "https://github.com/Atlas-1510/facebook" }}
        target="_blank"
      >
        {/* Colour is equivalent to tailwind neutral-400 */}
        <IconContext.Provider value={{ color: "#a3a3a3", size: "3rem" }}>
          <SiGithub />
        </IconContext.Provider>
      </Link>
    </div>
  );
}

export default GitHubLink;
