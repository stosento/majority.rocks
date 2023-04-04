import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Room = ({ socket }) => {
   
    const [users, setUsers] = useState([]);
    const [id, setId] = useState("")
    const { roomId } = useParams();
   
    useEffect(() => {
        console.log('users', users);
        socket.on('userListResponse', (data) => {
            console.log("data in userListResponse", data);
            updateUsers(data);
        });
        setId(roomId);
        console.log(`Room ${roomId} Users: `, users);
    }, [socket]);

    const updateUsers = (data) => {
        console.log("Updating my users")
        setUsers(data);
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
                <button className="w-full h-24 m-4 font-bold rounded bg-blue-500 text-xl">
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