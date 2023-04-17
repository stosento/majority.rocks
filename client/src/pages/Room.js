import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";

import { useLocation } from "react-router-dom";
import RoomHeader from "../components/RoomHeader";
import PlayerWrapper from "../components/PlayerWrapper";
import HostInfo from "../components/HostInfo";
import Listeners from "../components/Listeners";
import Playback from "../components/Playback";
import RoomButtons from "../components/RoomButtons";

const spotifyApi = new SpotifyWebApi();

const Room = ({ socket }) => {

    const navigate = useNavigate();
    const location = useLocation();

    console.log("location", location);
    const state = location.state;

    const [spotifyToken, setSpotifyToken] = useState(state.token? state.token : null);
    const [roomLoaded, setRoomLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [skipTarget, setSkipTarget] = useState(1);
    const [host, setHost] = useState(state.host ? state.host : null);
    const [roomCode, setRoomCode] = useState("");
    const [disableSkip, setDisableSkip] = useState(false);
    const [currentPlayback, setCurrentPlayback] = useState({});

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
        socket.on('hostLeft', () => {
            navigate('/');
        });
        socket.on('skipSong', (data) => {
            if (data.socketId === socket.id) {
                console.log("TODO - SEND SKIP TO SPOTIFY");
                spotifyApi.skipToNext().then(() => {
                    console.log("Skipping song");
                })
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
        console.log("In the setupRoom", state);
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
        setSkipTarget(data.skipTarget);
    }

    return (
        <div className="grid grid-cols-1 justify-items-center">
            <RoomHeader 
                code={roomCode}
                leaveCb={handleLeave}
            />
            <div className="w-full grid grid-cols-1 justify-items-center">
                <div className="w-1/2 grid-grid-cols-1">
                    <HostInfo host={host}/>
                    <Listeners users={users}/>
                </div>
                <div className="w-1/2 text-center">
                    <Playback playback={currentPlayback}/>
                    <RoomButtons
                        skipCb={handleSkip}
                        disableSkip={disableSkip}
                    />
                </div>
                <div className="w-1/2 text-center">
                    <p className="font-teko text-3xl">SKIP RULE: <span className="text-blue-600">&#123;</span> {skipTarget} <span className="text-blue-600">&#125;</span> room vote will skip the song</p>
                </div>
            </div>
            {spotifyToken !== null ? 
                <div className="fixed inset-x-0 bottom-0">
                    <PlayerWrapper
                        spotifyApi={spotifyApi}
                        spotifyToken={spotifyToken}
                    />
                </div> 
            : <></>}
        </div>
    );
}

export default Room;