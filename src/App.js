import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './homePage';
import SignupPage from './sign';
import LoginHolderPage from './loginHolder';

const App = () => {
  return (
<BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login_holder" element={<LoginHolderPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
