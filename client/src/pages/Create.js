import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { generateRoomCode, getTokenFromUrl } from "../utils/utils";
import Header from "../components/Header";
import TextBar from "../components/TextBar";
import Dropdown from "../components/Dropdown";
import {IconBrandSpotify} from "@tabler/icons-react";
import WideButton from "../components/buttons/WideButton";
import { SkipRule } from "../objects/enums";

const Create = ({ socket, spotifyApi }) => {

    const options = [
        {value: SkipRule.SINGLE, label: "Single"},
        {value: SkipRule.MAJORITY, label: "Majority"},
        {value: SkipRule.EVERYONE, label: "Everyone"}
    ];

    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    const [nameError, setNameError] = useState(false);
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
        if (userName === '') {
            setNameError(true);
            return;
        }
        const roomCode = generateRoomCode();
        socket.emit('createRoom', {roomCode, userName, socketId: socket.id, skipRule: skipRule.value, roomType: 'music'});
        navigate('/room', {state: {token: spotifyAccessToken, roomCode, skipRule: skipRule.value, host: { userName, socketId: socket.id}}});
    }

    const createGeneralRoom = (e) => {
        e.preventDefault();
        if (userName === '') {
            setNameError(true);
            return;
        }
        const roomCode = generateRoomCode();
        socket.emit('createRoom', {roomCode, userName, socketId: socket.id, skipRule: skipRule.value, roomType: 'general'});
        navigate('/generalRoom', {state: {roomCode, skipRule: skipRule.value, host: { userName, socketId: socket.id}}});
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
                    error={nameError}
                />
                <Dropdown
                    id="skipRule"
                    label="Choose your skip rule"
                    placeholder="SELECT..."
                    options={options}
                    value={skipRule}
                    cb={setSkipRule}
                />
                <div className="grid grid-cols-2 pt-10">
                    <div className="grid grid-cols-1">
                        <button
                            className="h-24 m-2 px-2 py-8 font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl"
                            onClick={createGeneralRoom}
                        >
                            General
                        </button>
                    </div>
                    <div className="grid grid-cols-1">
                        <button
                            className="h-24 m-2 px-2 py-8 font-bold rounded bg-[#1DB954] hover:bg-[#129e43] active:bg-[#2f7949] text-xl"
                            onClick={createRoom}
                        >
                           <p className="flex justify-center">
                                <IconBrandSpotify className="mt-1 mr-1"/>Music
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create;