import React, { useState } from 'react';
import TextBar from '../TextBar';
import { Modal } from "react-bootstrap";

const PromptModal = ({show, setShow, animations, setAnimations, prompt, handlePrompt}) => {

    const [text, setText] = useState("");

    const handleClose = () => {
        setShow(false);
        setAnimations(true);
    }

    return (
        <>
          <Modal 
            className='text-gray-700' 
            show={show} 
            onHide={handleClose} 
            backdrop="static"
            animation={animations}
          >
            <Modal.Header className="bg-gray-800 text-white" closeButton>
              <Modal.Title>Room Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-gray-800 text-white'>
                <TextBar 
                    id="prompt"
                    label="Enter your skip prompt"
                    placeholder="Prompt..."
                    value={text}
                    cb={setText}
                />
            </Modal.Body>
            <Modal.Footer className="bg-gray-800">
                <button
                    className="text-white rounded bg-green-700 h-10 w-1/4"
                    onClick={handlePrompt(text)}
                >
                    Set Prompt
                </button>
                <button
                    className="text-white rounded bg-gray-500 h-10 w-1/6"
                    onClick={handleClose}
                >
                    Exit
                </button>
            </Modal.Footer>
          </Modal>
        </>
      );
}

export default PromptModal;