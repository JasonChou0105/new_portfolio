import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Background from "./components/Background";
import { CrayonDrawingProvider } from "./components/crayon/CrayonDrawingContext";
import CrayonDrawingToolbar from "./components/crayon/CrayonDrawingToolbar";

function App() {
  return (
    <CrayonDrawingProvider>
      <Navbar />
      <Background count={100}>
        <Hero />
        <About />
        <Projects />
        <Skills />
      </Background>
      <CrayonDrawingToolbar />
    </CrayonDrawingProvider>
  );
}

export default App;
