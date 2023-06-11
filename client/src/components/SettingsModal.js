import React, { useState } from 'react';
import { Modal } from "react-bootstrap";

const SettingsModal = (props) => {

    const handleClose = () => props.setShow(false);

    return (
        <>
          <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>What do I do here?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-2">This site was built to assist in building a playlist around your running cadence.</div>
                <div className="mb-3">Whether you know your running cadence or just have a song you know you like to run to, this application is meant to assist in finding similar or new music that matches your running style.</div>
                <ul className="list-decimal">
                    <li>Login using your Spotify credentials</li>
                    <li>Fill out a quick form to best match your running to music</li>
                    <li>Build a playlist from a curated list of songs that best fits you</li>
                </ul>
            </Modal.Body>
            <Modal.Footer>
                Blah
            </Modal.Footer>
          </Modal>
        </>
      );
}

export default SettingsModal;