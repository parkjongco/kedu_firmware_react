import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from '../approval/approval.module.css';
import axios from 'axios';

function Example() {
    const [show, setShow] = useState(false);
    const [listA, setListA] = useState([
        { text: 'Cras justo odio', disabled: false },
        { text: 'Dapibus ac facilisis in', disabled: false },
        { text: 'Morbi leo risus', disabled: false },
        { text: 'Porta ac consectetur ac', disabled: false },
        { text: 'Vestibulum at eros', disabled: false }
    ]);
    const [listB, setListB] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleClose = () => {
        listB.forEach((item) => {
            axios.post('http://192.168.1.43:80/approval', {
                "data": item
            })
            .then(response => console.log('Success:', response))
            .catch(error => console.error('Error:', error));
        });
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleItemClick = (index) => {
        if (!filteredListA[index].disabled) {
            const selectedItem = filteredListA[index];
            setListB([...listB, selectedItem]);
            setListA(listA.map(item => item.text === selectedItem.text ? { ...item, disabled: true } : item));
        }
    };

    const handleItemRemove = (index) => {
        const item = listB[index];
        setListB(listB.filter((_, i) => i !== index));
        setListA(listA.map((listItem) => listItem.text === item.text ? { ...listItem, disabled: false } : listItem));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredListA = listA.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                전자결재
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>전자 결재</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup type="text" className='mb-3' name="approval_title">
                        <Form.Control
                            placeholder="제목을 입력하세요"
                            aria-label="Example text with button addon"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    <InputGroup name="approval_content">
                        <Form.Control as="textarea" aria-label="With textarea" placeholder="내용을 입력하세요" />
                    </InputGroup>
                    <hr></hr>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <h5>결재문서 업로드</h5>
                        <Form.Control type="file" multiple />
                    </Form.Group>
                    <hr></hr>
                    <h5>결재권자 추가</h5>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="검색어를 입력하세요"
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                    <div className={styles.listDiv}>
                        <ListGroup className={styles.listGroup}>
                            {filteredListA.map((item, index) => (
                                <ListGroup.Item className={styles.listItem}
                                    key={index}
                                    onClick={() => handleItemClick(index)}
                                    style={{ cursor: item.disabled ? 'not-allowed' : 'pointer', opacity: item.disabled ? 0.5 : 1 }}
                                >
                                    {item.text}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <hr />
                        <ListGroup>
                            {listB.map((item, index) => (
                                <ListGroup.Item className={styles.listItem}
                                    key={index}
                                    onClick={() => handleItemRemove(index)}
                                    style={{ cursor: 'pointer' }} 
                                    name="testName"
                                >
                                    {item.text}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Example;
