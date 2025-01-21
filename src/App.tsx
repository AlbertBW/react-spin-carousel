import "./App.css";
import Carousel from "./components";

function App() {
  return (
    <>
      <Carousel>
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
      </Carousel>
    </>
  );
}

export default App;
