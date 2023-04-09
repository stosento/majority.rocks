import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const Create = ({ socket }) => {

    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    const [skipRule, setSkipRule] = useState("");

    const options = [
        {value: "blah", label: "blah"},
        {value: "test", label: "test"}
    ];

    const navigate = useNavigate();

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
            <div className="w-2/3 pt-8 pb-4">
                <label className="w-full" for="name"> 
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
            <div className="w-2/3 pt-8 pb-4">
                <label className="w-full" for="skipRule"> 
                    Choose your skip rule:
                </label>
                <Select 
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={options}
                    onChange={setSkipRule}
                    value={skipRule}
                    isClearable 
                    styles={{
                            control: (base) => ({
                                ...base,
                                background: 'rgb(17 24 39)'
                            }),
                            menu: (base) => ({
                                ...base,
                                background: 'black'
                            }),
                            option: (base) => ({
                                ...base,
                                color: 'white'
                            })
                    }}
                />
                <input 
                    className="w-full p-2 uppercase bg-gray-900 border border-gray-400 rounded-md transition duration-500 ease-in-out hover:border-blue-700 focus:outline-none focus:border-blue-700"
                    type="text"
                    placeholder="Name..."
                    id="skipRule"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value.toUpperCase())}
                ></input>
            </div>
        </div>
        </>
    );
}

export default Create;