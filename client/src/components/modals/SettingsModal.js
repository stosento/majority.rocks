import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
import { SkipRule } from '../../objects/enums';
import Dropdown from '../Dropdown';

const SettingsModal = (props) => {

    const options = [
        {value: SkipRule.SINGLE, label: "Single"},
        {value: SkipRule.MAJORITY, label: "Majority"},
        {value: SkipRule.EVERYONE, label: "Everyone"}
    ];
    const [skipRule, setSkipRule] = useState(props.skipRule);

    const handleClose = () => props.setShow(false);

    return (
        <>
          <Modal className='text-gray-700' show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Room Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Dropdown
                    id="skipRule"
                    label="Skip Rule"
                    placeholder="SELECT..."
                    options={options}
                    value={skipRule}
                    cb={setSkipRule}
                />
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="text-white rounded bg-green-700 h-10 w-1/4"
                    onClick={props.updateSettings}
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