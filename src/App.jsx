import "./App.css";
import Background from "./components/Background";
import Title from "./components/Title";

function App() {
  return (
    <>
      <Background count={100}>
        <Title />
      </Background>
    </>
  );
}

export default App;
