import React, { useEffect, useState } from 'react';
import TextBar from '../TextBar';
import { Modal } from "react-bootstrap";
import TextInput from '../TextInput';

const PromptModal = ({show, setShow, animations, setAnimations, onSubmit, value}) => {

    const [text, setText] = useState(value);

    const handleClose = () => {
      setShow(false);
    }

    const handleInputChange = (e) => {
      setText(e.target.value.toUpperCase());
    }

    const handleSubmit = () => {
      onSubmit(text);
      setShow(false);
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
                <TextInput 
                    id="prompt"
                    label="Enter your skip prompt"
                    placeholder="Prompt..."
                    value={text}
                    onValueChange={handleInputChange}
                />
            </Modal.Body>
            <Modal.Footer className="bg-gray-800">
                <button
                    className="text-white rounded bg-green-700 h-10 w-1/4"
                    onClick={handleSubmit}
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