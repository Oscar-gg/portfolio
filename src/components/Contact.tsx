import { ContactList } from "./List/contactList";

export const Contact = () => {
  return (
    <div className="flex flex-col">
      <h2 className="mb-10 text-white">
        Don't hesitate to reach out; I'm open to constructive feedback and to
        collaborate on projects!
      </h2>
      <ContactList />
    </div>
  );
};
