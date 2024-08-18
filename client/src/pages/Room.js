import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";

import RoomHeader from "../components/RoomHeader";
import PlayerWrapper from "../components/PlayerWrapper";
import HostInfo from "../components/HostInfo";
import Listeners from "../components/Listeners";
import Playback from "../components/Playback";
import RoomButtons from "../components/buttons/RoomButtons";

import 'react-toastify/dist/ReactToastify.css';
import Toast from "../components/Toast";
import SkipText from "../components/SkipText";
import SettingsButton from "../components/buttons/SettingsButton";
import { generateToastMessage } from "../utils/utils";
import SavedButton from "../components/buttons/SavedButton";
import LeaveModal from "../components/modals/LeaveModal";

const spotifyApi = new SpotifyWebApi();

const Room = ({ socket }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const [spotifyToken, setSpotifyToken] = useState(state.token? state.token : null);
    const [roomLoaded, setRoomLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [skipTarget, setSkipTarget] = useState(1);
    const [skipRule, setSkipRule] = useState(state.skipRule ? state.skipRule : null);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [host, setHost] = useState(state.host ? state.host : null);
    const [roomCode, setRoomCode] = useState("");
    const [disableSkip, setDisableSkip] = useState(false);
    const [currentPlayback, setCurrentPlayback] = useState({});
    const [savedSongs, setSavedSongs] = useState({});

    useEffect(() => {

        if (!roomLoaded) {
            if (spotifyToken) {
                setupSpotify();
            }
            setupRoom();
            setRoomLoaded(true);
        }

        socket.on('userListResponse', (data) => {
            updateUsers(data);
        });
        socket.on('roomInfo', (data) => {
            updateRoomInfo(data);
        });
        socket.on('userJoined', (data) => {
            updateRoomInfo(data.room);
            generateToastMessage(`${data.name} joined the room!`);
        })
        socket.on('userLeft', (data) => {
            updateRoomInfo(data.room);
            generateToastMessage(`${data.name} left the room!`);
        })
        socket.on('updatedSettings', (data) => {
            setSkipTarget(data.skipTarget);
            generateToastMessage('Settings have been updated!');
        })

        socket.on('hostLeft', () => {
            navigate('/', {state: {roomClosed: true} });
        });

        socket.on('skipSong', (data) => {
            if (data.host.socketId === socket.id) {
                spotifyApi.skipToNext()
                    .then(() => {
                        console.log('Successfully skipped to next track');
                        return new Promise(resolve => setTimeout(resolve, 500));
                    })
                    .then(() => spotifyApi.getMyCurrentPlayingTrack())
                    .then((result) => {
                        console.log('Raw API response:', JSON.stringify(result));
                        if (result && result.item) {
                            const trackInfo = {
                                artist: result.item.artists.map(artist => artist.name).join(', '),
                                song: result.item.name,
                                image: result.item.album.images[0]?.url || ''
                            };
                            updatePlayback(trackInfo);
                        } else {
                            console.warn('Unexpected API response structure:', result);
                            // Handle case where track info is not available
                            updatePlayback({artist: 'Unknown', song: 'Unknown', image: ''});
                        }
                    })
                    .catch((error) => {
                        console.error('Error in Spotify API calls:', error);
                        if (error.response) {
                            console.error('Error response:', error.response);
                        }
                        // Handle error case
                        updatePlayback({artist: 'Error', song: 'Unable to fetch track info', image: ''});
                    });
            }
            setDisableSkip(false);
            generateToastMessage('Song has been skipped');
        });

    }, []);

    const setupSpotify = () => { // We are host, so room needs to be built
        if (spotifyToken) {
            spotifyApi.setAccessToken(spotifyToken);
        }
    }

    const setupRoom = () => {
        if (state.code) {
            socket.emit('getRoomInfo', state.code);
        }
    }

    const leaveModal = () => {
        setShowLeaveModal(true);
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
        socket.emit('updatePlayback', {playback: element, roomCode: state.roomCode});
    }

    const updateUsers = (users) => {
        setUsers(users);
    }

    const updateSettings = (skipRule) => {
        socket.emit("updateSkipRule", {rule: skipRule, roomCode: roomCode});
    }

    const handleSkip = () => {
        socket.emit("pressSkip", roomCode);
        setDisableSkip(true);
    }

    const handleSave = () => {
        const song = currentPlayback.text
        savedSongs[song] = '';
        setSavedSongs(savedSongs);
        console.log(savedSongs);
        console.log("Count of saved songs: ", savedSongs.length)
        generateToastMessage('Song has been saved');
    }

    const updateRoomInfo = (data) => {
        setUsers(data.users);
        setHost(data.host);
        setRoomCode(data.roomCode);
        setSkipTarget(data.skipTarget);
        setCurrentPlayback(data.playback);
    }

    return (
        <>
        <Toast/>
        {leaveModal ? 
            <LeaveModal
                show={showLeaveModal} 
                setShow={setShowLeaveModal}
                leaveCb={handleLeave}
            /> : <></>}
        <div className="grid grid-cols-1 justify-items-center">
            <RoomHeader 
                code={roomCode}
                leaveCb={leaveModal}
            />
            <div className="w-full grid grid-cols-1 justify-items-center">
                <div className="w-3/4 md:w-1/2 grid-grid-cols-1 mb-3">
                    <HostInfo host={host}/>
                    <Listeners users={users}/>
                </div>
                <div className="w-5/6 md:w-1/2 text-center">
                    <Playback playback={currentPlayback}/>
                    <RoomButtons
                        skipCb={handleSkip}
                        saveCb={handleSave}
                        disableSkip={disableSkip}
                    />
                </div>
                <SkipText count={skipTarget}/>
                <SettingsButton
                    currentId={socket.id}
                    hostId={host ? host.socketId : null}
                    updateSettings={updateSettings}
                    skipRule={skipRule}
                />
                <SavedButton
                    savedSongs={savedSongs}
                />
            </div>
            {spotifyToken !== null ? 
                <div className="fixed inset-x-0 bottom-0">
                    <PlayerWrapper
                        playback={currentPlayback}
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