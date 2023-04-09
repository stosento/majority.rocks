import React, { useState, useEffect } from "react";
import RoomCode from "../components/RoomCode";
import { useNavigate } from "react-router-dom";

const Home = ({ socket }) => {

    const loginUrl = process.env.NODE_ENV !== 'production'
        ? 'http://localhost:8888/login'
        : 'https://majority.rocks/login';

    const navigate = useNavigate();

    const [showCode, setShowCode] = useState(false);
    const [userName, setUserName] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {

        socket.on("joinRoomFailed", (roomCode) => {
            console.log("Unable to find room");
            setErrorMsg(`Room ${roomCode} does not exist`);
        });
        socket.on("joinRoomSuccess", (roomCode) => {
            console.log("Joining room", roomCode);
            navigate(`/room`, { roomInfo: { roomCode }});
        })

    }, []);

    const createRoom = (e) => {
        e.preventDefault();
        window.location.replace(loginUrl);
    }

    const joinRoom = (e) => {
        e.preventDefault();
        localStorage.setItem('action', 'join');
        localStorage.setItem('userName', userName);

        console.log(`${userName} joining room`);
        socket.emit('joinRoom', {roomCode: inputCode, userName, socketId: socket.id});
    }

    return (
        <>
        <div className="w-full grid grid-cols-1 justify-items-center">
            <div className="jusity-items-center my-3 cursor-pointer" onClick={() => {navigate("/");}}>
                <h1 className="text-center font-teko text-7xl">MAJORITY<span className="text-blue-600">.</span>ROCKS</h1>
            </div>
            <div className="w-1/2">
                <p className="cent text-center mb-5 text-lg font-alkatra text-gray-200">
                    An anonymous "vote to skip" application for group listening settings.
                </p>
            </div>
            <div class="border-b-2 border-gray-500 w-5/12 mb-5"></div>
            <div className="w-1/2">            
                <div className="grid grid-cols-2">
                    <div className="grid grid-cols-1">
                        <button 
                            className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl"
                            onClick={createRoom}
                        >
                            Create Room
                        </button>
                    </div>
                    <div className="grid grid-cols-1">
                        <button className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl" onClick={() => setShowCode(!showCode)}>
                            Join Room
                        </button>
                        <RoomCode 
                            show={showCode}
                            value={inputCode}
                            setValue={setInputCode}
                            joinRoom={joinRoom}
                            errorMsg={errorMsg}
                        />
                    </div>
                </div>

                <div className="grid grid-rows-1">
                    <button className="h-10 m-4 px-4 font-bold rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-lg text-gray-200" onClick={() => setShowCode(!showCode)}>
                        How it works
                    </button>
                </div>
            </div>
        </div>
        </>
    );
  };
  
  export default Home;