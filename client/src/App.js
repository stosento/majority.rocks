import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="blogs" element={<Blogs />}/>
          <Route path="contact" element={<Contact />}/>
          <Route path="*" element={<NoPage />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
