import React, { useState, useEffect } from "react";
import RoomCode from "../components/RoomCode";
import { initiateSocketConnection, subscribeToChat, disconnectSocket } from "../socketio.service";
import { useNavigate } from "react-router-dom";
import generateRoomCode from "../utils";

const Home = ({ socket }) => {

    const navigate = useNavigate();

    const [showCode, setShowCode] = useState(false);
    const [userName, setUserName] = useState("");

    const createRoom = (e) => {
        e.preventDefault();

        const roomCode = generateRoomCode();
        localStorage.setItem('userName', userName);

        // send to node.js
        socket.emit('createRoom', {roomCode, userName, socketId: socket.id});
        
        navigate(`/room/${roomCode}`);
    }

    return (
        <div className="w-full grid grid-cols-1 justify-items-center">
            <h1 className="text-center text-4xl">MAJORITY.ROCKS</h1>
            <form onSubmit={createRoom}>
                <div className="w-1/2 pt-8 pb-4">
                    <label className="w-full" for="name"> 
                        Enter your name: 
                    </label>
                    <input 
                        className="w-full px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-xl uppercase border-0 shadow outline-none focus:outline-none focus:ring"
                        type="text"
                        placeholder="Name..."
                        id="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    ></input>
                </div>

                <div className="w-3/4 grid grid-cols-2">
                    <div className="grid grid-cols-1">
                        <button 
                            className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-500 text-xl"
                            // onClick={createRoom}
                        >
                            Create Room
                        </button>
                    </div>
                    <div className="grid grid-cols-1">
                        <button className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-500 text-xl" onClick={() => setShowCode(!showCode)}>
                            Join Room
                        </button>
                        <RoomCode 
                            show={showCode}
                        />
                    </div>
                </div>

            </form>
        </div>
    );
  };
  
  export default Home;