import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Editor from "../pages/Editor";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
