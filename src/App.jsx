/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import "./App.scss";

function App() {
  const [messages, setMessages] = useState("");
  const [message, setMessage] = useState("");

  const newMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    setMessages(message);
    setMessage("");
  };

  return (
    <section>
      <div id="message-container">{messages}</div>
      <form id="form">
        <label htmlFor="message-input">Message</label>
        <input
          type="text"
          id="message-input"
          onChange={(e) => {
            newMessage(e);
          }}
          value={message}
        />
        <button id="send-button" type="button" onClick={handleSend}>
          Send
        </button>
        <label htmlFor="room-input">Room</label>
        <input type="text" id="room-button" />
        <button id="room-button" type="button">
          Join
        </button>
      </form>
    </section>
  );
}

export default App;
