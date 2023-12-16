import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Room from "./pages/Room";
import NoPage from "./pages/NoPage";

import './App.css';
import { io } from "socket.io-client";
import { initiateSocketConnection } from "./socketio.service";
import SpotifyWebApi from "spotify-web-api-js";
import Create from "./pages/Create";
import Join from "./pages/Join";
import GeneralCreate from "./pages/GeneralCreate";
import GeneralRoom from "./pages/GeneralRoom";

// const socket = initiateSocketConnection();
const socket = io.connect('http://localhost:8888')
const spotifyApi = new SpotifyWebApi();

function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
          <Route index element={<Home socket={socket}/>}/>
          <Route path="create" element={<Create socket={socket} spotifyApi={spotifyApi}/>}/>
          <Route path="general" element={<GeneralCreate socket={socket}/>}/>
          <Route path="join" element={<Join socket={socket}/>}/>
          <Route path="join/:roomId" element={<Join socket={socket}/>}/>
          <Route path="room" element={<Room socket={socket}/>}/>
          <Route path="generalRoom" element={<GeneralRoom socket={socket}/>}/>
          <Route path="*" element={<NoPage />}/>
        {/* </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
