import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Activate from "./pages/Activate";
import Collections from "./pages/Collections";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RecoverEditKey from "./pages/RecoverEditKey";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/activate/:token' element={<Activate />}/>
        <Route path='/collections' element={<Collections />}/>
        <Route path='/recovery' element={<ForgotPassword />}/>
        <Route path='/reset/:token' element={<ResetPassword />}/>
        <Route path='/recover/:token' element={<RecoverEditKey />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
