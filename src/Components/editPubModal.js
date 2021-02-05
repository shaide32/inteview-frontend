import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const EditModal = (props) => {
    const [inputs, setInputs] = useState(props.inputs);
    const handleSubmit = () => {
        props.editPub(inputs);
        props.handleCloseModal();
    };
    useEffect(() => {
        setInputs(props.inputs);
    }, [props])


    const handleInputChange = (event) => {
        event.preventDefault();
        setInputs(inputs => ({
            ...inputs,
            [event.target.name]: event.target.value
        }));
    };
    console.log(inputs);
    return (
        <Modal
            show={props.showModal}
            onHide={props.handleCloseModal}
            backdrop="static"
        >
            <Modal.Header closeButton>
            <Modal.Title>Edit Publication</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" onChange={handleInputChange} value={inputs.title} placeholder="Enter the title"/>
                    <input type="text" name="year" onChange={handleInputChange} value={inputs.year} placeholder="Enter the year"/>
                </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleSubmit}>Edit Publication </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
