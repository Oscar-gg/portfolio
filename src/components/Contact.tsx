import { ContactList } from "./List/contactList";

export const Contact = () => {
  return (
    <div className="flex flex-col">
      <h2 className="mb-10 text-white">
        Feel free to reach out, I'm always open to new opportunities and
        collaborations!
      </h2>
      <ContactList />
    </div>
  );
};
