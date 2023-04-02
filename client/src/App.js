import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Room from "./pages/Room";
import NoPage from "./pages/NoPage";

import './App.css';
import { disconnectSocket, initiateSocketConnection, subscribeToChat } from "./socketio.service";

function App() {

  useEffect(() => {
    initiateSocketConnection();
    subscribeToChat((err, data) => {
      console.log(data);
    });
    return () => {
      disconnectSocket();
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="room" element={<Room />}/>
          <Route path="*" element={<NoPage />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
