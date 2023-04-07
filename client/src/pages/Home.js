import React, { useState, useEffect } from "react";
import RoomCode from "../components/RoomCode";
import { initiateSocketConnection, subscribeToChat, disconnectSocket } from "../socketio.service";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { generateRoomCode, getTokenFromUrl } from "../utils";

const spotifyApi = new SpotifyWebApi();

const Home = ({ socket }) => {

    const url = process.env.NODE_ENV !== 'production'
        ? 'http://localhost:8888/login'
        : 'https://mytempo.run/login';

    const navigate = useNavigate();

    const [authenticated, setAuthenticated] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [userName, setUserName] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setupSpotify();

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
        console.log("authenticated", authenticated);
        authenticated ? navigate('/room') : window.location.replace(url) ;
    }

    const joinRoom = (e) => {
        e.preventDefault();
        localStorage.setItem('action', 'join');
        localStorage.setItem('userName', userName);

        console.log(`${userName} joining room`);
        socket.emit('joinRoom', {roomCode: inputCode, userName, socketId: socket.id});
    }

    const setupSpotify = () => {
        const urlToken = getTokenFromUrl().access_token;
        const storageToken = localStorage.getItem("spotifyToken");
        if (urlToken) {
            console.log("URL TOKEN");
            localStorage.setItem("spotifyToken", urlToken);
            spotifyApi.setAccessToken(urlToken);
            setAuthenticated(true);
        } else if (localStorage.getItem("spotifyToken")) {
            console.log("STORAGE TOKEN");
            spotifyApi.setAccessToken(storageToken);
            setAuthenticated(true);
        }
    }

    return (
        <div className="w-full grid grid-cols-1 justify-items-center">
            <h1 className="text-center text-4xl">MAJORITY.ROCKS</h1>
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
                    onChange={(e) => setUserName(e.target.value.toUpperCase())}
                ></input>
            </div>

            <div className="w-3/4 grid grid-cols-2">
                <div className="grid grid-cols-1">
                    <button 
                        className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-500 text-xl"
                        onClick={createRoom}
                    >
                        {authenticated ? "Create Room" : "Authenticate w/ Spotify to Create Room"}
                    </button>
                </div>
                <div className="grid grid-cols-1">
                    <button className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-500 text-xl" onClick={() => setShowCode(!showCode)}>
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
        </div>
    );
  };
  
  export default Home;