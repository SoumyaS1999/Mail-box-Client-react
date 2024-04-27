
import { useState, useEffect } from "react";
import {useDispatch} from "react-redux";
import { authActions } from "../Store/auth";
import { toast } from "react-toastify";

const Inbox = () => {
  const [inboxmail, setInboxmail] = useState([]);
  const [idmail, setIdmail] = useState([]);
  const currentuser = localStorage.getItem("uuid");
  const [encodedCurrentUser, setEncodedCurrentUser] = useState("");
  const [count,setCount]= useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch= useDispatch();

  useEffect(() => {
    const encodeEmail = (email) => {
      if (!email) {
        return "";
      }
      return email.replace(/@/g, "-at-").replace(/\./g, "-dot-");
    };

    if (currentuser) {
      const encodedUser = encodeEmail(currentuser);
      setEncodedCurrentUser(encodedUser);
    }
  }, [currentuser]);

  const fetchMails = async () => {
    try {
      const response = await fetch(
        `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/inbox.json`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
  
      const loadedMails = [];
      let temp = 0;
  
      for (const key in data) {
        loadedMails.push({
          id: key,
          sender: data[key].from,
          receiver: data[key].to,
          subject: data[key].subject,
          body: data[key].body,
          time: data[key].timestamp,
          isRead: data[key].isRead || false, // Add isRead property
        });
  
        if (!data[key].isRead) {
          temp = temp + 1;
        }
      }
  
      setCount(temp);
      dispatch(authActions.setCount(temp));
      setInboxmail(loadedMails);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
  

      fetchMails();
    
  }, [fetchMails]);

  useEffect(() => {
    // Here, you can perform any additional actions related to count
    // This effect will run whenever the count state changes
  }, [count]);

  useEffect(() => {
    const intervalId = setInterval(fetchMails, 60000); // Fetch mails every minute

    return () => clearInterval(intervalId); // Cleanup function to clear interval
  }, []);

  const markMailAsRead = async (id) => {
    const updatedMails = inboxmail.map((mail) => {
      if (mail.id === id) {
        mail.isRead = true;
        // Update isRead property in backend
        updateIsReadInBackend(id, true);
      }
      return mail;
    });
    setCount(count-1);
    dispatch(authActions.setCount(count-1));
    setInboxmail(updatedMails);
  };

  const fetchMailById = async (id) => {
    // Fetch mail by id function...
    console.log("id is", id);
    try {
      const response = await fetch(
        `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/inbox/${id}.json`,
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

  const updateIsReadInBackend = async (id, isRead) => {
    try {
      await fetch(
        `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/inbox/${id}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRead: isRead,
          }),
        },
      );
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

  const DeleteHandler=async(id)=>{
    const response = await fetch(
      `https://mail-box-client-e1fde-default-rtdb.firebaseio.com/users/${encodedCurrentUser}/inbox/${id}.json`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      toast.warning("Item is deleted");
      fetchMails();
      //return { payload: id };
    } else {
      toast.error("Failed to delete item");
      //return { payload: null };
  }
}


  return (
    <div>
      <h1> Inbox </h1>
      {count}
      <div style={{ display: "flex" }}>
        <div>
          <ul>
            {inboxmail.map((mail) => (
              <li key={mail.id} style={{listStyle:"none"}}>
                <button
                  onClick={() => {
                fetchMailById(mail.id);
                markMailAsRead(mail.id);
                handleButtonClick();
                  }}
                className={mail.isRead ? "btn btn-outline-success" : "btn btn-outline-primary"}
                style={{ minWidth: "270px", borderRadius:"0%"}}
                >

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
        {showAlert && <div class="alert alert-dismissible alert-light" style={{ minWidth: "70%", marginLeft:"20px"}}>
          <ul>
            {idmail.map((mail) => (
              <li key={mail.id} style={{listStyle:"none"}}>
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

export default Inbox;
