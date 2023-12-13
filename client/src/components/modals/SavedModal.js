import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
import { SkipRule } from '../../objects/enums';
import Dropdown from '../Dropdown';

const SavedModal = ({show, setShow, savedSongs}) => {

    const handleClose = () => {
        setShow(false);
    }

    const songs = Object.keys(savedSongs).map(k => (
        <li>
            {k}
        </li>
    ));

    return (
        <>
          <Modal className='text-gray-700' show={show} onHide={handleClose}>
            <Modal.Header className="bg-gray-800 text-white" closeButton>
              <Modal.Title>Saved Songs</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-gray-800 text-white'>
                <ul>
                    {songs}
                </ul>
            </Modal.Body>
            <Modal.Footer className="bg-gray-800">
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

export default SavedModal;