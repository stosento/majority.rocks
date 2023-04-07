import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import SpotifyPlayer from "react-spotify-web-playback";
import { generateRoomCode, getTokenFromUrl } from "../utils";
import { useLocation } from "react-router-dom";

const spotifyApi = new SpotifyWebApi();

const Room = ({ socket }) => {

    const navigate = useNavigate();
    const { roomInfo } = useLocation();

    const [spotifyToken, setSpotifyToken] = useState("");
   
    const [roomLoaded, setRoomLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [host, setHost] = useState({});
    const [roomCode, setRoomCode] = useState("");
    const [disableSkip, setDisableSkip] = useState(false);
   
    useEffect(() => {

        setupSpotify();

        if (!roomLoaded) {
            console.log("Room isn't loaded")
            setupRoom();
        }

        socket.on('userListResponse', (data) => {
            console.log("userListResponse received", data);
            updateUsers(data);
        });
        socket.on('roomInfo', (data) => {
            console.log("getRoomInfo received", data);
            updateRoomInfo(data);
        });
        socket.on('hostLeft', () => {
            navigate('/');
        });
        socket.on('skipSong', (data) => {
            if (data.socketId === socket.id) {
                console.log("TODO - SEND SKIP TO SPOTIFY");
                //Skip next song
            }
            setDisableSkip(false);
        });

    }, [socket]);

    const setupSpotify = () => {
        if (!roomInfo) { // We are host, so room needs to be built
            const spotifyToken = getTokenFromUrl().access_token;
            if (spotifyToken) {
                setSpotifyToken(spotifyToken);
                spotifyApi.setAccessToken(spotifyToken);
            }
        }
    }

    const setupRoom = () => {

        console.log("roomInfo in setupRoom", roomInfo);

        const action = localStorage.getItem('action');
        const userName = localStorage.getItem('userName');

        if (!roomInfo) {
            console.log("Generating room code");
            const roomCode = generateRoomCode();
            socket.emit('createRoom', {roomCode, userName, socketId: socket.id});
        } else {
            console.log("Getting room info");
            socket.emit('getRoomInfo', roomInfo.roomCode);
        }

        setRoomLoaded(true);
    }

    const updateUsers = (users) => {
        console.log("Updating my users", users);
        setUsers(users);
    }

    const handleSkip = () => {
        socket.emit("pressSkip", roomCode);
        setDisableSkip(true);
    }

    const updateRoomInfo = (data) => {
        console.log("update room info", data);
        setUsers(data.users);
        setHost(data.host);
        setRoomCode(data.roomCode);
    }

    return (
        <>
        <h1 className="text-center text-4xl">MAJORITY.ROCKS</h1>
        <div className="w-full grid grid-cols-3 justify-items-center">
            <div className="w-full text-center">
                <h2>Users</h2>
                <ul className="list-disc list-inside">
                    {users.map((user) => (
                        <li key={user.socketId}>{user.userName}</li>
                    ))}
                </ul>
            </div>
            <div className="w-full text-center">
                Playback will go here
                <button 
                    className="w-full h-24 m-4 font-bold rounded bg-blue-500 text-xl hover:bg-blue-700 disabled:bg-blue-950"
                    onClick={handleSkip}
                    disabled={disableSkip}
                >
                    Skip
                </button>
            </div>
            <div className="w-full text-center grid-cols-1 pt-8 pb-4 justify-items-center">
                <h2>Settings</h2>
                <h3>Room Code: {roomCode}</h3>
            </div>
        </div>
        <div className="fixed inset-x-0 bottom-0">
            <SpotifyPlayer
                token={spotifyToken}
                magnifySliderOnHover
                layout='responsive'
                styles={{
                    bgColor: 'white'
                }}
            />
        </div>
        </>
    );
}

export default Room;