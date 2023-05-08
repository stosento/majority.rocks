import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";

import RoomHeader from "../components/RoomHeader";
import PlayerWrapper from "../components/PlayerWrapper";
import HostInfo from "../components/HostInfo";
import Listeners from "../components/Listeners";
import Playback from "../components/Playback";
import RoomButtons from "../components/RoomButtons";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Toast from "../components/Toast";
import SkipText from "../components/SkipText";

const spotifyApi = new SpotifyWebApi();

const Room = ({ socket }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const [spotifyToken, setSpotifyToken] = useState(state.token? state.token : null);
    const [roomLoaded, setRoomLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [skipTarget, setSkipTarget] = useState(1);
    const [host, setHost] = useState(state.host ? state.host : null);
    const [roomCode, setRoomCode] = useState("");
    const [disableSkip, setDisableSkip] = useState(false);
    const [currentPlayback, setCurrentPlayback] = useState({});
    const [disableRoomButtons, setDisableRoomButtons] = useState(true);

    useEffect(() => {
        console.log("in room useeffect");

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
        socket.on('userJoined', (data) => {
            console.log("userJoined");
            toast.info(`${data.name} joined the room!`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            updateRoomInfo(data.room);
        })
        socket.on('userLeft', (data) => {
            console.log("userLeft");
            toast.info(`${data.name} left the room!`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            updateRoomInfo(data.room);
        })


        socket.on('hostLeft', () => {
            navigate('/', {state: {roomClosed: true} });
        });
        socket.on('skipSong', (data) => {
            if (data.host.socketId === socket.id) {
                spotifyApi.skipToNext().then(async () => {
                    setTimeout(() => {
                        spotifyApi.getMyCurrentPlayingTrack().then((result) => {
                            updatePlayback(result.item);                           
                        });
                    }, 500);
                });
            }
            setDisableSkip(false);
            toast.info(`Song has been skipped`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        });

    }, []);

    const setupSpotify = () => { // We are host, so room needs to be built
        if (spotifyToken) {
            console.log("setting spotify")
            spotifyApi.setAccessToken(spotifyToken);
        }
    }

    const setupRoom = () => {
        if (state.code) {
            console.log("getting room info in setup room");
            socket.emit('getRoomInfo', state.code);
        }
    }

    const handleLeave = () => {
        socket.emit('leaveRoom', {roomCode: roomCode, socketId: socket.id});
        navigate('/');
    }

    const updatePlayback = (playback) => {
        const element = {
            artist: playback.artists[0].name,
            song: playback.name,
            image: playback.album.images[0].url
        }
        console.log("updating playback within Room");
        console.log("element", element);
        setCurrentPlayback(element);
        socket.emit('updatePlayback', {playback: element, roomCode: state.roomCode});
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
        setSkipTarget(data.skipTarget);
        setCurrentPlayback(data.playback);
    }

    return (
        <>
        <Toast/>
        <div className="grid grid-cols-1 justify-items-center">
            <RoomHeader 
                code={roomCode}
                leaveCb={handleLeave}
            />
            <div className="w-full grid grid-cols-1 justify-items-center">
                <div className="w-1/2 grid-grid-cols-1 mb-3">
                    <HostInfo host={host}/>
                    <Listeners users={users}/>
                </div>
                <div className="w-1/2 text-center">
                    <Playback playback={currentPlayback}/>
                    <RoomButtons
                        disableButtons={disableRoomButtons}
                        skipCb={handleSkip}
                        disableSkip={disableSkip}
                    />
                </div>
                <SkipText count={skipTarget}/>
            </div>
            {spotifyToken !== null ? 
                <div className="fixed inset-x-0 bottom-0">
                    <PlayerWrapper
                        spotifyApi={spotifyApi}
                        spotifyToken={spotifyToken}
                        updatePlayback={updatePlayback}
                    />
                </div> 
            : <></>}
        </div>
        </>
    );
}

export default Room;