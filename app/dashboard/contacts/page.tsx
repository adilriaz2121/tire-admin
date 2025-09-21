import React from "react";
import ContactsPage from "@/components/contacts";

const Contacts = () => {
  return (
    <div className=" lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Contact Messages</h3>
      <div className="max-w-[95rem] mx-auto w-full">
        <ContactsPage />
      </div>
    </div>
  );
};

export default Contacts;
