import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const EditModal = (props) => {
    const [inputs, setInputs] = useState({});
    const handleSubmit = () => {
        props.addPub(inputs);
        props.handleCloseModal();
    };



    const handleInputChange = (event) => {
        event.preventDefault();
        setInputs(inputs => ({
            ...inputs,
            [event.target.name]: event.target.value
        }));
    };

    return (
        <Modal
            show={props.showModal}
            onHide={props.handleCloseModal}
            backdrop="static"
        >
            <Modal.Header closeButton>
            <Modal.Title>Add Publication</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" onChange={handleInputChange} placeholder="Enter the title"/>
                    <input type="text" name="year" onChange={handleInputChange} placeholder="Enter the year"/>
                </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleSubmit}>Add Publication </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
