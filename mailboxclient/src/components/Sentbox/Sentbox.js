
import { useState, useEffect } from "react";
const Sentbox = () => {
  const [inboxmail, setInboxmail] = useState([]);
  const currentuser = localStorage.getItem("uuid");
  const [idmail, setIdmail] = useState([]);
  const encodeEmail = (email) => {
    if (!email) {
      return "";
    }
    return email.replace(/@/g, "-at-").replace(/\./g, "-dot-");
  };
  const encodedCurrentUser = encodeEmail(currentuser);

  const fetchmails = async () => {
    try {
      const response = await fetch(
        `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/sent.json`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      const loadedMails = [];

      for (const key in data) {
        loadedMails.push({
          id: key,
          sender: data[key].from,
          receiver: data[key].to,
          subject: data[key].subject,
          body: data[key].body,
          time: data[key].timestamp,
        });

        setInboxmail(loadedMails);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMailById = async (id) => {
    console.log("id is", id);
    try {
      const response = await fetch(
        `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/sent/${id}.json`,
      );
      if (!response.ok) {
        console.log("failed to sent");
        throw new Error("Failed to fetch mail");
      }
      const data = await response.json();
      // Handle the fetched mail data, e.g., display it in a modal or another component
      const loadedMail = {
        id: id,
        sender: data.from,
        receiver: data.to,
        subject: data.subject,
        body: data.body,
        time: data.timestamp,
      };

      setIdmail([loadedMail]);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchmails();
  }, []);

  return (
    <div>
      <h1> Inbox </h1>
      <div style={{ display: "flex" }}>
        <div>
          <ul>
            {inboxmail.map((mail) => (
              <li key={mail.id}>
                <button onClick={() => fetchMailById(mail.id)}>
                  <strong>From:</strong> {mail.sender}
                  <br />
                  <strong>To:</strong> {mail.receiver}
                  <br />
                  <strong>Subject:</strong> {mail.subject}
                  <br />
                  <strong>Time:</strong> {new Date(mail.time).toLocaleString()}
                  <br />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ minWidth: "600px" }}>
          <ul>
            {idmail.map((mail) => (
              <li key={mail.id}>
                <strong>From:</strong> {mail.sender}
                <br />
                <strong>To:</strong> {mail.receiver}
                <br />
                <strong>Subject:</strong> {mail.subject}
                <br />
                <strong>Body:</strong> {mail.body}
                <br />
                <strong>Time:</strong> {new Date(mail.time).toLocaleString()}
                <br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sentbox;
