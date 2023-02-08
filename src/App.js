import logo from "./logo.svg";
import "./App.css";
import data from "./media/index.json";
import { useEffect, useRef, useState } from "react";

function App() {
  const [activePad, setActivePad] = useState("--");
  const [volume, setVolume] = useState(0.5);
  const [tapped, setTapped] = useState();
  const [power, setPower] = useState(false);

  const handlePlayPad = (name, id) => {
    if (power === true) {
      const audioPad = document.getElementById(id);
      if (audioPad === null) return;
      audioPad.currentTime = 0; // solves the delayed play issue by resetting the current audio time
      audioPad.play();
      setActivePad(name.replace(/-/g, " "));
      setTapped(id);
    }
  };

  // console.log(tapped);

  const handlePlayKey = (event) => {
    if (power === true) {
      // make the key input event to upper case before comparing it
      const upperCaseEventKey = event.key.toUpperCase();
      data.forEach((pad) => {
        if (upperCaseEventKey === pad.id) {
          handlePlayPad(pad.name, pad.id);
        }
      });
    }
  };

  useEffect(() => {
    if (power === true) {
      document.addEventListener("keydown", handlePlayKey);
      return () => {
        document.removeEventListener("keydown", handlePlayKey);
      };
    }
  }, [power]);

  const handleChangeVolume = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    if (power === true) {
      const audioPads = Array.from(document.getElementsByClassName("clip"));
      // console.log(audioPads);
      audioPads.forEach((audioPad) => {
        audioPad.volume = volume;
      });
    }
  }, [volume, power]);

  const handlePowerSwitch = () => {
    setPower(!power);
  };
  console.log(power);
  return (
    <div className="App">
      <div id="drum-machine">
        <div className="pads-container">
          <div className="drum-pads">
            {data.map((pad) => (
              <div
                className={`drum-pad ${
                  tapped === pad.id ? "tapped" : "not-tapped"
                }`}
                key={pad.id}
                id={pad.name}
                onClick={(e) => handlePlayPad(e.target.id, pad.id)}
              >
                <audio id={pad.id} src={pad.audio} className="clip"></audio>
                <span>{pad.id}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="controls">
          <div
            id="display"
            className={power === true ? "display-on" : "display-off"}
          >
            <span id="active-pad">{power === true ? activePad : "--"}</span>
            <span id="volume">
              {power === true ? `Vol ${(+volume * 100).toFixed(0)}` : `--`}
            </span>
          </div>
          <div className="inputs">
            <div className="input-wrapper">
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleChangeVolume}
              />
            </div>
          </div>
          <button
            className={`power ${power === true ? "on" : "off"}`}
            onClick={() => handlePowerSwitch()}
          >
            <div className="power-inner">
              <span>Power</span>
            </div>
          </button>
          {/* <div>
            AKAI <br />
            PROFESSIONAL
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
