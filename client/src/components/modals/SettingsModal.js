import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
import { SkipRule } from '../../objects/enums';
import Dropdown from '../Dropdown';

const SettingsModal = ({show, setShow, updateSettings, skipRule}) => {

    const options = [
        {value: SkipRule.SINGLE, label: "Single"},
        {value: SkipRule.MAJORITY, label: "Majority"},
        {value: SkipRule.EVERYONE, label: "Everyone"}
    ];
    const [rule, setRule] = useState(skipRule);

    const handleClose = () => {
        setShow(false);
    }
    
    const saveSettings = () => {
        updateSettings(rule.value);
        setShow(false);
    }

    return (
        <>
          <Modal className='text-gray-700' show={show} onHide={handleClose}>
            <Modal.Header className="bg-gray-800 text-white" closeButton>
              <Modal.Title>Room Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-gray-800 text-white'>
                <Dropdown
                    id="skipRule"
                    label="Skip Rule"
                    placeholder="SELECT..."
                    options={options}
                    value={rule}
                    cb={setRule}
                />
            </Modal.Body>
            <Modal.Footer className="bg-gray-800">
                <button
                    className="text-white rounded bg-green-700 h-10 w-1/4"
                    onClick={saveSettings}
                >
                    Save Changes
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

export default SettingsModal;