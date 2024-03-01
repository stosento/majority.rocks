import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import RoomHeader from "../components/RoomHeader";
import HostInfo from "../components/HostInfo";
import JoinedUsers from "../components/JoinedUsers";
import SettingsButton from "../components/buttons/SettingsButton";
import SkipButton from "../components/buttons/SkipButton";
import SkipText from "../components/SkipText";
import Toast from "../components/Toast";

import { generateToastMessage } from "../utils/utils";
import 'react-toastify/dist/ReactToastify.css';
import PromptText from "../components/PromptText";
import PromptModal from "../components/modals/PromptModal";
import LeaveModal from "../components/modals/LeaveModal";

const GeneralRoom = ({ socket }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const isHost = state.host ? state.host.socketId === socket.id : false;

    const [roomLoaded, setRoomLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [prompt, setPrompt] = useState(state.prompt ? state.prompt : "");
    const [showPromptModal, setShowPromptModal] = useState(isHost);
    const [showPromptExit, setShowPromptExit] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [promptModalAnimations, setPromptModalAnimations] = useState(false);
    const [skipTarget, setSkipTarget] = useState(1);
    const [skipRule, setSkipRule] = useState(state.skipRule ? state.skipRule : null);
    const [host, setHost] = useState(state.host ? state.host : null);
    const [roomCode, setRoomCode] = useState("");
    const [disableSkip, setDisableSkip] = useState(false);

    useEffect(() => {

        if (!roomLoaded) {
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

            }
            setDisableSkip(false);
            generateToastMessage('The room has voted to skip!');
        });

    }, []);

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

    const updateRoomInfo = (data) => {
        setUsers(data.users);
        setHost(data.host);
        setRoomCode(data.roomCode);
        setPrompt(data.prompt);
        setSkipTarget(data.skipTarget);
    }

    const handlePromptModalSubmit = (text) => {
        console.log('Handle prompt submit modal');
        socket.emit("updatePrompt", {roomCode: roomCode, prompt: text});
        setPromptModalAnimations(true);
        setShowPromptExit(true);
        setPrompt(text);
    }

    return (
        <>
        <Toast/>
        {leaveModal ? 
            <LeaveModal
                show={showLeaveModal} 
                setShow={setShowLeaveModal}
                leaveCb={handleLeave}
            /> : <></>
        }
        {showPromptModal ? 
            <PromptModal
                show={showPromptModal} 
                setShow={setShowPromptModal}
                animations={promptModalAnimations}
                setAnimations={setPromptModalAnimations}
                value={prompt}
                onSubmit={handlePromptModalSubmit}
                showExit={showPromptExit}
            /> : <></>
        }
        <div className="grid grid-cols-1 justify-items-center">
            <RoomHeader 
                code={roomCode}
                leaveCb={leaveModal}
            />
            <div className="w-full grid grid-cols-1 justify-items-center">
                <div className="w-1/2 grid-grid-cols-1 mb-3">
                    <HostInfo host={host}/>
                    <JoinedUsers users={users}/>
                </div>
                <div className="w-1/2 text-center">
                    <PromptText 
                        text={prompt}
                        textCb={setShowPromptModal}
                        isHost={host ? host.socketId === socket.id : false}
                    />
                    <SkipButton
                        skipCb={handleSkip}
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
            </div>
        </div>
        </>
    );
}

export default GeneralRoom;