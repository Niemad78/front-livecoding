/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.scss";

function App() {
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:8000");
    setSocket(socket);

    socket.on("initialMessage", (initialMessage) => {
      setMessages(initialMessage);
    });

    socket.on("updateMessageList", (listMessage) => {
      setMessages(listMessage);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("newMessageFromClient", {
      author: nickname,
      text: newMessage,
    });
    setNewMessage("");
  };

  // Enlever le backstick après message.text
  // changer la value du second input
  // puis push le nouveau template

  return (
    <section>
      <h2>Messages</h2>
      {messages?.map((message) => (
        <div key={message.id}>
          {message.author} : {message.text}
        </div>
      ))}
      <h2>New message</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="author"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          type="text"
          name="messageContent"
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <input type="submit" value="Send" />
      </form>
    </section>
  );
}

export default App;
