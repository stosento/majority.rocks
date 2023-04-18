import { useEffect, useState } from "react";
import Header from "../components/Header";
import TextBar from "../components/TextBar";
import WideButton from "../components/WideButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Toast from "../components/Toast";

const Join = ({ socket }) => {

    const navigate = useNavigate();

    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    const [roomCode, setRoomCode] = useState("");

    useEffect(() => {

        socket.on("joinRoomFailed", (roomCode) => {
            toast.error(`Room ${roomCode} does not exist`, {
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
        socket.on("joinRoomSuccess", (roomCode) => {
            console.log("Joining room", roomCode);
            navigate(`/room`, { state: { code: roomCode } });
        })

    }, []);

    const joinRoom = (e) => {
        e.preventDefault();
        socket.emit('joinRoom', {userName, roomCode, socketId: socket.id})
    }

    return (
        <>
        <Toast/>
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
                    length={4}
                    cb={setRoomCode}
                />
                <WideButton
                    text="Join"
                    onClick={joinRoom}
                />
            </div>
        </div>
        </>
    );
}

export default Join;