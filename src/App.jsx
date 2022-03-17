import React from "react";
import "./App.scss";
import logo from "./assets/logoDwM.png";

function App() {
  return (
    <section>
      <div className="containerForm">
        <div className="containerCircle">
          <span className="form" />
          <span className="form" />
          <span className="form" />
        </div>
      </div>
      <div>
        <img src={logo} alt="Damien Mauger Développement Web" />
        <p>Damien Mauger</p>
        <p>Developpement web</p>
      </div>
    </section>
  );
}

export default App;
