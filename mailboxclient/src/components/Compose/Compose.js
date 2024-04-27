
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const ComposeMail = () => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  //const [body, setBody] = useState("");
  const [editorState, setEditorState] = useState(() =>
  EditorState.createEmpty()
);
  const currentUser = localStorage.getItem("uuid");


  const encodeEmail = (email) => {
    return email.replace(/@/g, "-at-").replace(/\./g, "-dot-");
  };
  const encodedRecipient = encodeEmail(recipient);
  const encodedCurrentUser = encodeEmail(currentUser);

  const handleSend = () => {
    if (!recipient || !subject ||  !editorState.getCurrentContent().hasText()) return;

    const mailData = {
      from: encodedCurrentUser, // Add composer's email
      to: encodedRecipient,
      subject,
      body: editorState.getCurrentContent().getPlainText(),
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
    //setBody("");
    setEditorState(EditorState.createEmpty());

    toast.success("Mail send successfully");
  };

  return (
    <div style={{marginTop:"10px"}}>
      <label>To</label><br></br>
      <input
        style={{minWidth:"100vw"}}
        type="text"
        placeholder="To"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      /><br></br>
      <label>Subject</label><br></br>
      <input
        style={{minWidth:"100vw"}}
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      /><br></br>
      <label>Body</label>

       <Editor
        editorState={editorState}
        wrapperClassName="editor-wrapper"
        editorClassName="editor"
        onEditorStateChange={setEditorState}
        editorStyle={{ backgroundColor: "#f5f5f5", minHeight: "200px" }}
      />
      <button style={{minWidth:"200px"}}type="submit" className="btn btn-outline-info" onClick={handleSend}>Send</button>
    </div>
  );
};

export default ComposeMail;
