/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { useState } from "react";
import "./App.scss";

// const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [mail, setMail] = useState({
    name: "",
    objet: "",
    message: "",
  });

  const handleText = (e, id) => {
    if (id === 1) {
      setMail({ ...mail, name: e.target.value });
    }
    if (id === 2) {
      setMail({ ...mail, objet: e.target.value });
    }
    if (id === 3) {
      setMail({ ...mail, message: e.target.value });
    }
  };

  const sendMail = () => {
    console.log("Hello World");
  };

  return (
    <section className="global">
      <form className="formEmail">
        <label className="labelEmail" htmlFor="name">
          Nom
          <input
            id="name"
            name="name"
            type="text"
            value={mail.name}
            onChange={(e) => handleText(e, 1)}
          />
        </label>
        <label className="labelEmail" htmlFor="objet">
          Objet
          <input
            id="objet"
            name="objet"
            type="text"
            value={mail.objet}
            onChange={(e) => handleText(e, 2)}
          />
        </label>
        <label className="labelEmail" htmlFor="message">
          Message
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="10"
            value={mail.message}
            onChange={(e) => handleText(e, 3)}
          />
        </label>
        <button type="button" onClick={sendMail}>
          Envoyer
        </button>
      </form>
    </section>
  );
}

export default App;
