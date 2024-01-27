import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './login';
import SignupPage from './sign';

const App = () => {
  return (
<BrowserRouter>
      <Routes>
          <Route path="/" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
