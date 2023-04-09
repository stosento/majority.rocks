import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { generateRoomCode, getTokenFromUrl } from "../utils";

const animatedComponents = makeAnimated();
const SkipRule = Object.freeze({
    SINGLE:   Symbol("single"),
    MAJORITY:  Symbol("majority"),
    EVERYONE: Symbol("everyone")
  });

const Create = ({ socket, spotifyApi }) => {

    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    const [skipRule, setSkipRule] = useState("");

    const options = [
        {value: SkipRule.SINGLE.toString, label: "Single"},
        {value: SkipRule.MAJORITY.toString, label: "Majority"},
        {value: SkipRule.EVERYONE.toString, label: "Everyone"}
    ];

    const navigate = useNavigate();

    const createRoom = (e) => {
        e.preventDefault();
        setupSpotify();

        const roomCode = generateRoomCode();
        socket.emit('createRoom', {roomCode, userName, socketId: socket.id});

        navigate('/room');
    }

    const setupSpotify = () => {
        const urlToken = getTokenFromUrl().access_token;
        const storageToken = localStorage.getItem("spotifyToken");
        if (urlToken) {
            console.log("URL TOKEN");
            localStorage.setItem("spotifyToken", urlToken);
            spotifyApi.setAccessToken(urlToken);
        } else if (localStorage.getItem("spotifyToken")) {
            console.log("STORAGE TOKEN");
            spotifyApi.setAccessToken(storageToken);
        }
    }

    return (
<>
        <div className="w-full grid grid-cols-1 justify-items-center">
            <div className="w-2/3 grid grid-flow-col auto-cols-max my-3 ">
                <div className="mr-3">
                    <h1 onClick={() => {navigate("/");}} className="text-left cursor-pointer font-teko text-5xl text-blue-600 hover:text-blue-700">&#8592;</h1>
                </div>
                <div className="self-center">
                    <h1 className="text-center font-teko text-7xl">CREATE ROOM</h1>
                </div>

            </div>
            <div className="w-2/3 pt-4 pb-4">
                <label className="w-full block pb-1" for="name"> 
                    Enter your name: 
                </label>
                <input 
                    className="w-full p-2 uppercase bg-gray-900 border border-gray-400 rounded-md transition duration-300 ease-in-out hover:border-blue-700 focus:outline-none focus:border-blue-700"
                    type="text"
                    placeholder="Name..."
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value.toUpperCase())}
                ></input>
            </div>
            <div className="w-2/3 pt-4 pb-2">
                <label className="w-full block pb-1" for="skipRule"> 
                    Choose your skip rule:
                </label>
                <div className="cursor-pointer">
                <Select 
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    placeholder="SELECT..."
                    defaultValue={options[1]}
                    options={options}
                    onChange={setSkipRule}
                    value={skipRule}
                    isClearable 
                    styles={{
                            control: (base, {isFocused, menuIsOpen}) => ({
                                ...base,
                                background: 'rgb(17 24 39)',
                                borderColor: 'rgb(156 163 175)',
                                borderRadius: '0.375rem',
                                paddingBottom: 2,
                                paddingTop: 2,
                                transition: 'ease-in-out',
                                transitionDuration: '300ms',
                                color: '#9CA3AF',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'rgb(29 78 216)'
                                }
                            }),
                            menu: (base) => ({
                                ...base,
                                background: 'rgb(17 24 39)'
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: '#9CA3AF'
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: 'white'
                            }),
                            input: (base) => ({
                                ...base,
                                color: 'white'
                            }),
                            option: (base, { isFocused, isSelected }) => ({
                                ...base,
                                color: 'white',
                                cursor: 'pointer',
                                background: isFocused ? 'rgb(31 41 55)' : 'rgb(17 24 39)'
                            }),

                    }}
                />
                </div>
                <div className="grid grid-cols-1 mt-8">
                    <button 
                        className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl"
                        onClick={createRoom}
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

export default Create;