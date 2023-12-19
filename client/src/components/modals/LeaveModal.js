import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
import { SkipRule } from '../../objects/enums';
import Dropdown from '../Dropdown';

const LeaveModal = ({show, setShow, leaveCb}) => {

    const handleClose = () => {
        setShow(false);
    }

    return (
        <>
          <Modal size="sm" className='text-gray-700' show={show} onHide={handleClose} contentClassName='bg-gray-800'>
            <Modal.Header className="bg-gray-800 text-white self-center border-b-0">
              <Modal.Title className="text-center">Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Footer className="bg-gray-800 justify-center">
                <button
                    className="text-white rounded bg-green-700 h-10 w-1/4"
                    onClick={leaveCb}
                >
                    Leave
                </button>
                <button
                    className="text-white rounded bg-gray-500 h-10 w-1/4"
                    onClick={handleClose}
                >
                    Cancel
                </button>
            </Modal.Footer>
          </Modal>
        </>
      );
}

export default LeaveModal;