/* eslint-disable no-console */
import React, { useState } from "react";
import axios from "axios";
import "./App.scss";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [newImage, setNewImage] = useState({});

  const handleImage = (event) => {
    setNewImage(event.target.files[0]);
  };

  const sendFile = (e) => {
    e.preventDefault();
    const image = new FormData();
    image.append("file", newImage);
    axios
      .post(`${API_URL}/api/images`, image)
      .then(() => {
        console.log("ok");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section>
      <form onSubmit={sendFile}>
        <input type="file" accept="image/*" onChange={(e) => handleImage(e)} />
        <input type="submit" value="Envoyer" />
      </form>
    </section>
  );
}

export default App;
