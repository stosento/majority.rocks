import { useState } from "react";
import Header from "../components/Header";
import TextBar from "../components/TextBar";
import WideButton from "../components/WideButton";
import { useNavigate } from "react-router-dom";

const Join = ({ socket }) => {

    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    const [roomCode, setRoomCode] = useState("");

    const navigate = useNavigate();

    const joinRoom = (e) => {
        e.preventDefault();

        socket.emit('joinRoom', {userName, roomCode, socketId: socket.id})

        navigate('/room');
    }

    return (
        <div className="w-full grid grid-cols-1 justify-items-center">
            <Header title="JOIN ROOM"/>
            <div className="w-2/3">
                <TextBar 
                    id="name"
                    label="Enter your name"
                    placeholder="Name..."
                    value={userName}
                    cb={setUserName}
                />
                <TextBar 
                    id="roomCode"
                    label="Enter the room code"
                    placeholder="Rome code..."
                    value={roomCode}
                    cb={setRoomCode}
                />
                <WideButton
                    text="Join"
                    onClick={joinRoom}
                />
            </div>
        </div>
    );
}

export default Join;