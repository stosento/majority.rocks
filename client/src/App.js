import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Room from "./pages/Room";
import NoPage from "./pages/NoPage";

import './App.css';
import { io } from "socket.io-client";
import { initiateSocketConnection } from "./socketio.service";

// const socket = initiateSocketConnection();
const socket = io.connect('http://localhost:8888')

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home socket={socket}/>}/>
          <Route path="room/" element={<Room socket={socket}/>}/>
          <Route path="room/:roomId" element={<Room socket={socket}/>}/>
          <Route path="*" element={<NoPage />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
