import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";


import { generateRoomCode, getTokenFromUrl } from "../utils";
import { useLocation } from "react-router-dom";
import RoomHeader from "../components/RoomHeader";
import PlayerWrapper from "../components/PlayerWrapper";

const spotifyApi = new SpotifyWebApi();

const Room = ({ socket }) => {

    const navigate = useNavigate();
    const location = useLocation();

    console.log("location", location);
    const state = location.state;

    const [spotifyToken, setSpotifyToken] = useState(state.token);
    const [currentDevice, setCurrentDevice] = useState("");
    const [roomLoaded, setRoomLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [host, setHost] = useState(state.host);
    const [roomCode, setRoomCode] = useState("");
    const [disableSkip, setDisableSkip] = useState(false);
    const [currentPlayback, setCurrentPlayback] = useState({});

    useEffect(() => {

        if (!roomLoaded) {
            console.log("Room isn't loaded");
            if (spotifyToken) {
                setupSpotify();
            }
            setupRoom();
            setRoomLoaded(true);
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

    }, []);

    const setupSpotify = () => { // We are host, so room needs to be built
        if (spotifyToken) {
            console.log("setting spotify")
            spotifyApi.setAccessToken(spotifyToken);
            spotifyApi.getMyCurrentPlayingTrack().then((result) => {
                updatePlayback(result.item);
            });
            spotifyApi.getMyCurrentPlaybackState().then((result) => {
                console.log("currentplayback", result);
            });
            spotifyApi.getMyDevices().then((result) => {
                console.log("avaialbledevices", result);
            });
        }
    }

    const setupRoom = () => {
        if (state.code) {
            console.log("getting room info in setup room");
            socket.emit('getRoomInfo', state.code);
        }
    }

    const updatePlayback = (playback) => {
        const element = {
            artist: playback.artists[0].name,
            song: playback.name,
            image: playback.album.images[0].url
        }
        setCurrentPlayback(element);
        console.log(playback);
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
        <div className="grid grid-cols-1 justify-items-center">
            <RoomHeader code={roomCode}/>
            <div className="w-full grid grid-cols-1 justify-items-center">
                <div className="w-1/2 grid-grid-cols-1">
                    <h2 className="font-teko text-3xl">Host:</h2>
                    <p>{host.userName}</p>
                    <h2 className="font-teko text-3xl">Listeners:</h2>
                    <ul className="list-disc list-inside">
                        {users.map((user) => (
                            <li key={user.socketId}>{user.userName}</li>
                        ))}
                    </ul>
                </div>
                <div className="w-1/2 text-center">
                    <div className="flex flex-col justify-center items-center">
                        <img className="h-52" src={currentPlayback.image}/>
                        <p>{currentPlayback.artist} - {currentPlayback.song}</p>
                    </div>
                    <div className="grid-flow-col grid-cols-2 flex">
                        <button
                            className="w-1/4 h-24 my-4 mx-1 font-bold text-xl rounded bg-blue-500 hover:bg-blue-700 disabled:bg-blue-950"
                        >
                            Save
                        </button>
                        <button 
                            className="w-3/4 h-24 my-4 mx-1 font-bold rounded bg-orange-500 text-xl hover:bg-orange-700 disabled:bg-orange-950"
                            onClick={handleSkip}
                            disabled={disableSkip}
                        >
                            Skip
                        </button>
                    </div>
                </div>
            </div>
            <div className="fixed inset-x-0 bottom-0">
                <PlayerWrapper
                    spotifyApi={spotifyApi}
                    spotifyToken={spotifyToken}
                />
            </div> 
        </div>
    );
}

export default Room;