import { FaGithub } from "react-icons/fa";
import { TiSocialLinkedinCircular } from "react-icons/ti";

import { IoMail } from "react-icons/io5";
import { contact } from "~/data/typed/objects";

export const ContactList = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-x-4 gap-y-4 ">
      <a href={contact.github}>
        <FaGithub
          className="animate-pulseButton rounded-full"
          color="white"
          size="40"
        />
      </a>
      <a href={contact.linkedin}>
        <TiSocialLinkedinCircular
          className="animate-pulseButton rounded-full"
          color="white"
          size="40"
        />
      </a>
      <a href={`mailto:${contact.email}`}>
        <IoMail className="animate-pulseButton" color="white" size="40" />
      </a>
    </div>
  );
};
