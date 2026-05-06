import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Artist from "./Artist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artist/:id" element={<Artist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
