import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Background from "./components/Background";

function App() {
  return (
    <>
      <Navbar />
      <Background count={100}>
        <Hero />
        <About />
        <Projects />
        <Skills />
      </Background>
    </>
  );
}

export default App;
