import React, { useState, useEffect } from "react";

const RoomCode = (props) => {

    useEffect(() => {
        console.log("show", props.show)
    },[props.show])

    return (
        props.show && (
            <div className="transition w-full px-10">
                <label className="w-full px-4" for="code"> 
                    Enter room code: 
                </label>
                <div className="w-full">
                    <input 
                        className="h-15 mx-3 px-3 py-3 text-lg uppercase placeholder-slate-300 text-slate-600 bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring"
                        type="text"
                        placeholder="Code..."
                        id="code"
                        value={props.value}
                        onChange={(e) => props.setValue(e.target.value)}
                    >    
                    </input>
                    <button 
                        className="font-bold rounded bg-blue-500 h-14 w-1/4"
                        onClick={props.joinRoom}
                    >
                        Enter
                    </button>
                    <p className="text-red-500">
                        {props.errorMsg}
                    </p>
                </div>
            </div>
        )
    );
}

export default RoomCode;