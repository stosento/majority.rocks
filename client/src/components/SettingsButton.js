import React, { useState } from "react";
import SettingsModal from "./SettingsModal";

const SettingsButton = ({ currentId, hostId }) => {

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <>
        {currentId === hostId ? 
            <button onClick={handleShowModal} className="w-1/4 px-5 py-1 my-2 font-bold text-lg rounded bg-gray-600 hover:bg-gray-800">
                Settings
            </button>
        : <></>}
        <div>
        <SettingsModal show={showModal} setShow={setShowModal}/>
        </div>
        
        </>
    );
}

export default SettingsButton;