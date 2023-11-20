import React, { useState } from "react";
import QRModal from "../modals/QRModal";

const QRButton = ({roomId}) => {

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <>
            <button onClick={handleShowModal} className="w-full my-1 font-bold text-m rounded bg-blue-500 hover:bg-blue-700 disabled:bg-blue-950">
                QR
            </button>
            <QRModal show={showModal} setShow={setShowModal} roomId={roomId}/>
        </>
    );
}

export default QRButton;