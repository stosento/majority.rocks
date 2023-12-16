import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { generateRoomCode, getTokenFromUrl } from "../utils/utils";
import Header from "../components/Header";
import TextBar from "../components/TextBar";
import Dropdown from "../components/Dropdown";
import WideButton from "../components/buttons/WideButton";
import { SkipRule } from "../objects/enums";

const GeneralCreate = ({ socket, spotifyApi }) => {

    const navigate = useNavigate();

    const options = [
        {value: SkipRule.SINGLE, label: "Single"},
        {value: SkipRule.MAJORITY, label: "Majority"},
        {value: SkipRule.EVERYONE, label: "Everyone"}
    ];

    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    const [prompt, setPrompt] = useState("");
    const [skipRule, setSkipRule] = useState(options[1]);

    const createRoom = (e) => {
        e.preventDefault();

        const roomCode = generateRoomCode();
        socket.emit('createRoom', {roomCode, userName, socketId: socket.id, skipRule: skipRule.value});
        navigate('/generalRoom', {state: {prompt, roomCode, skipRule: skipRule.value, host: { userName, socketId: socket.id}}});
    }

    return (
        <div className="w-full grid grid-cols-1 justify-items-center">
            <Header title="CREATE ROOM"/>
            <div className="w-2/3">
                <TextBar 
                    id="name"
                    label="Enter your name"
                    placeholder="Name..."
                    value={userName}
                    cb={setUserName}
                />
                <TextBar 
                    id="prompt"
                    label="Enter your room prompt"
                    placeholder="Prompt..."
                    value={prompt}
                    cb={setPrompt}
                />
                <Dropdown
                    id="skipRule"
                    label="Choose your skip rule"
                    placeholder="SELECT..."
                    options={options}
                    value={skipRule}
                    cb={setSkipRule}
                />
                <WideButton
                    text="Create"
                    onClick={createRoom}
                />
            </div>
        </div>
    );
}

export default GeneralCreate;