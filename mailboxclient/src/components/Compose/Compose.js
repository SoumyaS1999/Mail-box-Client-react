
import React, { useState } from "react";
import { toast } from "react-toastify";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";

// toast-configuration method,
// it is compulsory method.
//toast.configure();

const ComposeMail = () => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const currentUser = localStorage.getItem("uuid");
  const encodeEmail = (email) => {
    return email.replace(/@/g, "-at-").replace(/\./g, "-dot-");
  };
  const encodedRecipient = encodeEmail(recipient);
  const encodedCurrentUser = encodeEmail(currentUser);

  const handleSend = () => {
    if (!recipient || !subject || !body) return;

    const mailData = {
      from: encodedCurrentUser, // Add composer's email
      to: encodedRecipient,
      subject,
      body,
      timestamp: new Date().toISOString(),
      isread: false,
    };

    // POST request to send mail to sender's sentbox
    fetch(
      `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/sent.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailData),
      },
    )
      .then((response) => response.json())
      .then((data) => console.log("Mail sent to sender:", data))
      .catch((error) => console.error("Error sending mail to sender:", error));

    // POST request to send mail to recipient's inbox
    fetch(
      `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedRecipient}/inbox.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailData),
      },
    )
      .then((response) => response.json())
      .then((data) => console.log("Mail sent to recipient:", data))
      .catch((error) =>
        console.error("Error sending mail to recipient:", error),
      );

    // Clear the input fields after sending
    setRecipient("");
    setSubject("");
    setBody("");

    toast.success("Mail send successfully");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Write your message here..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ComposeMail;
