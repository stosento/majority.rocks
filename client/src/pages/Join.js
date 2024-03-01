import { useEffect, useState } from "react";
import Header from "../components/Header";
import TextBar from "../components/TextBar";
import WideButton from "../components/buttons/WideButton";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Toast from "../components/Toast";

const Join = ({ socket }) => {

    const navigate = useNavigate();
    const { roomId } = useParams();

    console.log('roomID: ', roomId);

    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    const [nameError, setNameError] = useState(false);
    const [roomCode, setRoomCode] = useState(roomId ? roomId : "");
    const [codeError, setCodeError] = useState(false);

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
        socket.on("joinRoomSuccess", (data) => {
            console.log("Joining room", data.roomCode);
            console.log("Room type: ", data.roomType);
            if (data.roomType === 'general') {
                navigate(`/generalRoom`, { state: { code: data.roomCode } });
            } else {
                navigate(`/room`, { state: { code: data.roomCode } });
            }
        })

    }, []);

    const joinRoom = (e) => {
        e.preventDefault();
        userName === '' ? setNameError(true) : setNameError(false);
        roomCode === '' ? setCodeError(true) : setCodeError(false);
        if (userName === '' || roomCode === '') {
            return;
        }
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
                    error={nameError}
                />
                <TextBar 
                    id="roomCode"
                    label="Enter the room code"
                    placeholder="Rome code..."
                    value={roomCode}
                    length={4}
                    cb={setRoomCode}
                    error={codeError}
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