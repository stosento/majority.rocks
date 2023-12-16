import React, { useState, useEffect } from "react";
import RoomCode from "../components/RoomCode";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Toast from "../components/Toast";

const Home = ({ socket }) => {

    const location = useLocation();
    const state = location.state;

    const loginUrl = process.env.NODE_ENV !== 'production'
        ? 'http://localhost:8888/login'
        : 'https://majority.rocks/login';

    const navigate = useNavigate();

    const [showCode, setShowCode] = useState(false);
    const [roomClosed, setRoomClosed] = useState(state !== null && state.roomClosed !== null 
                                                ? state.roomClosed 
                                                : false);

    const createRoom = (e) => {
        e.preventDefault();
        window.location.replace(loginUrl);
    }

    const createGeneralRoom = (e) => {
        e.preventDefault();
        navigate('/general');
    }

    const joinRoom = (e) => {
        e.preventDefault();
        navigate('/join');
    }

    useEffect(() => {
        if (roomClosed) {
            toast.error(`Room has been closed by host`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setRoomClosed(false);
        }
    }, []);

    return (
        <>
        <Toast/>
        <div className="w-full grid grid-cols-1 justify-items-center">
            <div className="jusity-items-center my-3 cursor-pointer" onClick={() => {navigate("/");}}>
                <h1 className="text-center font-teko text-7xl">MAJORITY<span className="text-blue-600">.</span>ROCKS</h1>
            </div>
            <div className="w-1/2">
                <p className="cent text-center mb-5 text-lg font-alkatra text-gray-200">
                    An anonymous "vote to skip" application for group listening settings.
                </p>
            </div>
            <div className="border-b-2 border-gray-500 w-5/12 mb-5"></div>
            <div className="w-1/2">
                <div class="grid grid-rows-2 grid-flow-col">
                    <div class="h-24 row-span-1 col-span-2 mr-4 my-2">
                        <button 
                            className="h-full w-full font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl"
                            onClick={createGeneralRoom}
                        >
                            Create General Room
                        </button>
                    </div>
                    <div class="h-24 row-span-1 col-span-2 mr-4 my-2">
                        <button 
                            className="h-full w-full font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl"
                            onClick={createRoom}
                        >
                            Create Music Room
                        </button>
                    </div>
                    <div class="row-span-3 ml-4 my-2">
                        <button 
                            className="h-full w-full font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl" 
                            onClick={joinRoom}>
                            Join Room
                        </button>
                    </div>
                </div> 
                <div className="grid grid-rows-1">
                    <button className="h-10 m-4 px-4 font-bold rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-lg text-gray-200" onClick={() => setShowCode(!showCode)}>
                        How it works
                    </button>
                </div>
            </div>
        </div>
        </>
    );
  };
  
  export default Home;