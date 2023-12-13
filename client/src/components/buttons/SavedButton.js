import React, { useState } from "react";
import SavedModal from "../modals/SavedModal";

const SavedButton = ({ savedSongs }) => {

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <>
            <button onClick={handleShowModal} className="w-1/6 px-5 py-1 my-2 font-bold text-lg rounded bg-gray-600 hover:bg-gray-800">
                Saved Songs
            </button>
            <SavedModal 
                show={showModal} 
                setShow={setShowModal}
                savedSongs={savedSongs}
            />
        </>
    );
}

export default SavedButton;