import { useState } from "react";
import "./App.css";
import Carousel from "./components";

function App() {
  const [reverse, setReverse] = useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [buttonScrollSpeed, setButtonScrollSpeed] = useState(autoplaySpeed * 2);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [playOnce, setPlayOnce] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [alwaysShowButtons, setAlwaysShowButtons] = useState(false);
  const [unlockFrameLimit, setUnlockFrameLimit] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [allowMouseDrag, setAllowMouseDrag] = useState(false);

  const handleBackgroundColour = () => {
    const colours = ["red", "green", "blue", "yellow", "orange", "purple"];
    const randomColour = colours[Math.floor(Math.random() * colours.length)];
    setBackgroundColor(randomColour);
  };

  return (
    <div>
      <header>
        <h1>React Carousel Spin</h1>

        <a href="/">Reset</a>
      </header>

      <Carousel
        autoplaySpeed={autoplaySpeed}
        autoplay={autoplay}
        buttonScrollSpeed={buttonScrollSpeed}
        showScrollbar={showScrollbar}
        playOnce={playOnce}
        hideButtons={hideButtons}
        pauseOnHover={pauseOnHover}
        alwaysShowButtons={alwaysShowButtons}
        unlockFrameLimit={unlockFrameLimit}
        backgroundColor={backgroundColor}
        allowMouseDrag={allowMouseDrag}
        reverse={reverse}
      >
        <div key={"child-1"} className="box">
          1
        </div>
        <div key={"child-2"} className="box">
          2
        </div>
        <div key={"child-3"} className="box">
          3
        </div>
        <div key={"child-4"} className="box">
          4
        </div>
        <div key={"child-5"} className="box">
          5
        </div>
        <div key={"child-6"} className="box">
          6
        </div>
        <div key={"child-7"} className="box">
          7
        </div>
        <div key={"child-8"} className="box">
          8
        </div>
        <div key={"child-9"} className="box">
          9
        </div>
        <div key={"child-10"} className="box">
          10
        </div>
      </Carousel>

      <div className="settings">
        <p>Reverse: {reverse ? "true" : "false"}</p>

        <p>Autoplay: {autoplay ? "true" : "false"}</p>

        <p>Autoplay Speed: {autoplaySpeed}</p>

        <p>Button Speed: {buttonScrollSpeed}</p>

        <p>Show Scrollbar: {showScrollbar ? "true" : "false"}</p>

        <p>Play Once: {playOnce ? "true" : "false"}</p>

        <p>Hide Buttons: {hideButtons ? "true" : "false"}</p>
      </div>

      <div className="buttons">
        <button onClick={() => setReverse((prev) => !prev)}>Reverse</button>

        <button onClick={() => setAutoplay((prev) => !prev)}>
          Toggle Autoplay
        </button>

        <button onClick={() => setAutoplaySpeed((prev) => prev + 1)}>
          Increase Autoplay Speed
        </button>

        <button onClick={() => setAutoplaySpeed((prev) => prev - 1)}>
          Decrease Autoplay Speed
        </button>

        <button onClick={() => setButtonScrollSpeed((prev) => prev + 1)}>
          Increase Button Speed
        </button>

        <button onClick={() => setButtonScrollSpeed((prev) => prev - 1)}>
          Decrease Button Speed
        </button>

        <button onClick={() => setShowScrollbar((prev) => !prev)}>
          Toggle Scrollbar
        </button>

        <button onClick={() => setPlayOnce((prev) => !prev)}>
          Toggle Play Once
        </button>

        <button onClick={() => setHideButtons((prev) => !prev)}>
          Toggle Hide Buttons
        </button>

        <button onClick={() => setPauseOnHover((prev) => !prev)}>
          Toggle Pause On Hover
        </button>

        <button onClick={() => setAlwaysShowButtons((prev) => !prev)}>
          Toggle Always Show Buttons
        </button>

        <button onClick={() => setUnlockFrameLimit((prev) => !prev)}>
          Toggle Unlock Frame Limit
        </button>

        <button onClick={() => handleBackgroundColour()}>
          Background {backgroundColor}
        </button>

        <button onClick={() => setAllowMouseDrag((prev) => !prev)}>
          Toggle Allow Mouse Drag
        </button>
      </div>
    </div>
  );
}

export default App;
