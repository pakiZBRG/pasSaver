import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Activate from "./components/Activate";
import Collections from "./components/Collections";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/activate/:token' element={<Activate />}/>
        <Route path='/collections' element={<Collections />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
