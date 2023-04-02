import React, { useEffect, useState } from "react";

const Room = ({ socket }) => {
   
    const [users, setUsers] = useState([]);
   
    useEffect(() => {
        socket.on('userListResponse', (data) => setUsers(data));
    }, [socket, users]);

    return (
        <>
        <h1 className="text-center text-4xl">MAJORITY.ROCKS</h1>
        <div className="w-full grid grid-cols-3 justify-items-center">
            <div className="w-full text-center">
                <h2>Users</h2>
                <ul className="list-disc list-inside">
                    {users.map((user) => (
                        <li key={user.socketID}>{user.userName}</li>
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
            </div>
        </div>
        </>
    );
}

export default Room;