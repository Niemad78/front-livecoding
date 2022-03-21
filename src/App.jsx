/* eslint-disable no-console */
import axios from "axios";
import React, { useState, useEffect } from "react";
import "./App.scss";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [image, setImage] = useState({});
  const [img, setImg] = useState({});

  const handleImage = (event) => {
    setImage(event.target.files[0]);
  };

  const sendFile = () => {
    const newImage = new FormData();
    newImage.append("file", image);
    axios
      .post(`${API_URL}/api/images`, newImage)
      .then(() => {
        console.log("ok");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getImages = () => {
    axios
      .get(`${API_URL}/api/images`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setImg(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <section>
      <form>
        <label htmlFor="image">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImage(event)}
          />
        </label>
      </form>
      <button type="button" onClick={sendFile}>
        Envoyer
      </button>
      <img src={`${API_URL}/images/${img.imageName}`} alt="test" />
    </section>
  );
}

export default App;
