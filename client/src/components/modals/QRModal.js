import { Modal } from "react-bootstrap";
import { QRCode } from "react-qr-code";

const QRModal = (props) => {

    const handleClose = () => props.setShow(false);

    return (
        <>
          <Modal className='text-white' show={props.show} onHide={handleClose} size='sm'>
            <Modal.Header className="bg-gray-800" closeButton>
              <Modal.Title className="flex">Scan to join</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex justify-center bg-gray-800'>
                <QRCode value={ window.location.href + '/' + props.roomId.toLowerCase()}/>
            </Modal.Body>
            <Modal.Footer className='bg-gray-800'>
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

export default QRModal;