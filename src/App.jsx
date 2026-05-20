import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Background from "./components/Background";
import Skills from "./components/sections/Skills";

function App() {
  return (
    <>
      <Navbar />
      <Background count={100}>
        <Hero />
        <Skills />
        {/* <About /> */}
      </Background>
    </>
  );
}

export default App;
