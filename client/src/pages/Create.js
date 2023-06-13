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

const Create = ({ socket, spotifyApi }) => {

    const options = [
        {value: SkipRule.SINGLE, label: "Single"},
        {value: SkipRule.MAJORITY, label: "Majority"},
        {value: SkipRule.EVERYONE, label: "Everyone"}
    ];

    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    const [skipRule, setSkipRule] = useState(options[1]);
    const [spotifyAccessToken, setSpotifyAccessToken] = useState("");

    useEffect(() => {
        setupSpotify();
    }, [])

    const navigate = useNavigate();

    const setupSpotify = () => {
        const urlToken = getTokenFromUrl().access_token;
        const storageToken = localStorage.getItem("spotifyToken");
        if (urlToken) {
            console.log("URL TOKEN", urlToken);
            localStorage.setItem("spotifyToken", urlToken);
            setSpotifyAccessToken(urlToken);
            spotifyApi.setAccessToken(urlToken);
        } else if (localStorage.getItem("spotifyToken")) {
            console.log("STORAGE TOKEN");
            spotifyApi.setAccessToken(storageToken);
            setSpotifyAccessToken(storageToken);
        }
    }

    const createRoom = (e) => {
        e.preventDefault();

        const roomCode = generateRoomCode();
        console.log("skiprule value", skipRule.value);
        socket.emit('createRoom', {roomCode, userName, socketId: socket.id, skipRule: skipRule.value});
        navigate('/room', {state: {token: spotifyAccessToken, roomCode, host: { userName, socketId: socket.id}}});
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

export default Create;