import React, { useState, useEffect } from 'react';
import { Modal, ListGroup, FormControl, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import styles from './ApprovalTemplateModal.module.css'; // CSS 모듈 사용

const serverUrl = process.env.REACT_APP_SERVER_URL;

function SecondModal({ show, onHide, listA }) {
    const [listB, setListB] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredListA, setFilteredListA] = useState([]);

    const handleItemClick = (item) => {
        const isAlreadyAdded = listB.some(bItem => bItem === item);
        if (!isAlreadyAdded) {
            setListB([...listB, item]);
        }
    };

    const handleItemRemove = (index) => {
        setListB(listB.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (Array.isArray(listA)) {
            setFilteredListA(listA.filter(item => item.users_name && item.users_name.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredListA([]);
        }
    }, [listA, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const templateSave = () => {
        axios.post(`${serverUrl}/ApprovalTemplate`, { listB })
            .then(response => {
                console.log('템플릿 저장 성공:', response.data);
            })
            .catch(error => {
                console.error('템플릿 저장 오류:', error);
            });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>템플릿 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <FormControl
                        type="text"
                        placeholder="템플릿 타이틀을 입력하세요."
                        className="mb-3"
                    />
                </InputGroup>
                <hr></hr>
                <InputGroup className="mb-3">
                    <FormControl
                        type="text"
                        placeholder="검색"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mb-3"
                    />
                </InputGroup>
                <div className={styles.listGroup}>
                    <ListGroup>
                        {filteredListA.map((item, index) => (
                            <ListGroup.Item
                                key={index}
                                className={styles.listItem}
                                onClick={() => handleItemClick(item)}
                                style={{
                                    cursor: 'pointer',
                                    opacity: listB.some(bItem => bItem.users_name === item.users_name) ? 0.5 : 1,
                                    pointerEvents: listB.some(bItem => bItem.users_name === item.users_name) ? 'none' : 'auto'
                                }}
                            >
                                [{item.department_title}] {item.users_name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <hr />
                    <ListGroup className={styles.horizontalList}>
                        {listB.map((item, index) => (
                            <ListGroup.Item
                                key={index}
                                onClick={() => handleItemRemove(index)}
                                className={styles.listItem}
                                style={{ cursor: 'pointer' }}
                            >
                                [{item.department_title}] {item.users_name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={templateSave}>템플릿 추가</Button>
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SecondModal;
