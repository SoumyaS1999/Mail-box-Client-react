//import { EditorState, convertFromRaw } from "draft-js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Sentbox = () => {
  const [inboxmail, setInboxmail] = useState([]);
  const currentuser = localStorage.getItem("uuid");
  const [idmail, setIdmail] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
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
  const handleButtonClick = () => {
    setShowAlert(true);
  };

  const handleButtonClose = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    fetchmails();
  }, []);

  const DeleteHandler=async(id)=>{
    const response = await fetch(
      `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/sent/${id}.json`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      toast.warning("Item is deleted");
      fetchmails();
      //return { payload: id };
    } else {
      toast.error("Failed to delete item");
      //return { payload: null };
  }
}


  return (
    <div>
      <h1> Inbox </h1>
      <div style={{ display: "flex" }}>
        <div>
          <ul>
            {inboxmail.map((mail) => (
              <li key={mail.id} style={{listStyle:"none"}}>
                <button  type="button" class="btn btn-outline-primary" style={{ minWidth:"270px", borderRadius:"0%"}} onClick={() => {fetchMailById(mail.id); handleButtonClick() }}>
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
        {showAlert && <div class="alert alert-dismissible alert-light" style={{marginLeft:"20px" ,minWidth: "70%"}}>
          <ul>
            {idmail.map((mail) => (
              <li key={mail.id} style={{listStyle:"none"}}>
                <strong>From:</strong> {mail.sender}
                <br />
                <strong>To:</strong> {mail.receiver}
                <br />
                <strong>Subject:</strong> {mail.subject}
                <br />
                <strong>Body:</strong>
                {mail.body}
                <br />
                <strong>Time:</strong> {new Date(mail.time).toLocaleString()}
                <br />
                <button className="btn btn-outline-danger" onClick={()=>{DeleteHandler(mail.id);handleButtonClose()}}
                style={{ position: "fixed", bottom: "20px", right: "20px" }}>Delete</button>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline-info" onClick={handleButtonClose}
          style={{ position: "fixed", bottom: "20px", left: "20px" }}>Hide mail</button>
        </div>}
      </div>
    </div>
  );
};

export default Sentbox;
