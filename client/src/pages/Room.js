import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Room = ({ socket }) => {
   
    const [initLoaded, setInitLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [host, setHost] = useState({});
    const [id, setId] = useState("");
    const [disableSkip, setDisableSkip] = useState(false);
    const { roomId } = useParams();
   
    useEffect(() => {

        if (!initLoaded) {
            socket.emit('getRoomInfo', roomId);
            setInitLoaded(true);
        }

        setId(roomId);

        socket.on('userListResponse', (data) => {
            console.log("userListResponse received", data);
            updateUsers(data);
        });
        socket.on('roomInfo', (data) => {
            console.log("getRoomInfo received", data);
            updateRoomInfo(data);
        });

    }, [socket]);

    const updateUsers = (users) => {
        console.log("Updating my users", users);
        setUsers(users);
    }

    const handleSkip = () => {
        socket.emit("pressSkip", id);
        setDisableSkip(true);
    }

    const updateRoomInfo = (data) => {
        console.log("update room info", data);
        setUsers(data.users);
        setHost(data.host);

        console.log("data.users", data.users);
        console.log("data.host", data.host);
    }

    return (
        <>
        <h1 className="text-center text-4xl">MAJORITY.ROCKS</h1>
        <div className="w-full grid grid-cols-3 justify-items-center">
            <div className="w-full text-center">
                <h2>Users</h2>
                <ul className="list-disc list-inside">
                    {users.map((user) => (
                        <li key={user.socketId}>{user.userName}</li>
                    ))}
                </ul>
            </div>
            <div className="w-full text-center">
                Playback will go here
                <button 
                    className="w-full h-24 m-4 font-bold rounded bg-blue-500 text-xl"
                    onClick={handleSkip}
                    disabled={disableSkip}
                >
                    Skip
                </button>
            </div>
            <div className="w-full text-center grid-cols-1 pt-8 pb-4 justify-items-center">
                <h2>Settings</h2>
                <h3>Room Code: {id}</h3>
            </div>
        </div>
        </>
    );
}

export default Room;