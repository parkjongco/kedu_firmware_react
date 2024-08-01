import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from '../approval/approval.module.css';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function Approval() {
    const [show, setShow] = useState(false);
    const [listA, setListA] = useState([
        { text: 'Cras justo odio' },
        { text: 'Dapibus ac facilisis in' },
        { text: 'Morbi leo risus'},
        { text: 'Porta ac consectetur ac'},
        { text: 'Vestibulum at eros'}
    ]);
    const [listB, setListB] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    //결재 코드 받을 useState
    const [approvalData, setApprovalData] = useState({"approval_title": '', "approval_type_seq": 0, "approval_contents":'', "approval_approver_seq": []});
    const [approvalTypeSeq, setApprovalTypeSeq] = useState('');
    const handleClose = () => {
        approvalData.approval_type_seq = approvalTypeSeq;
        console.log(approvalData);
        const parsedData = JSON.stringify(approvalData);
        axios.post('http://192.168.1.43/approval', 
            {
                "data":parsedData,
                "contentType": 'application/json'
            })
            .then(response => {
                console.log('Response:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleItemClick = (index) => {
        if (!filteredListA[index].disabled) {
            const selectedItem = filteredListA[index];
            
            // 결재자 정보를 approval_approver_seq에 추가
            setApprovalData(prevData => ({
                ...prevData,
                approval_approver_seq: [...prevData.approval_approver_seq, selectedItem]
            }));
    
            // 기존의 listB와 listA 상태 업데이트
            setListB([...listB, selectedItem]);
            setListA(listA.map(item => item.text === selectedItem.text ? { ...item.text, disabled: true } : item));
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

    const filteredListA = listA.filter(item => item.text && item.text.toLowerCase().includes(searchTerm.toLowerCase()));

    const selectedData = (e) => {
        const data = e.target.text;
        if (data.includes("001")) {
            setApprovalTypeSeq('001')
        } else if (data.includes("002")) {
            setApprovalTypeSeq('002')
        } else if (data.includes("003")) {
            setApprovalTypeSeq('003')
        } else if (data.includes("004")) {
            setApprovalTypeSeq('004')
        } else if (data.includes("005")) {
            setApprovalTypeSeq('005')
        } else if (data.includes("006")) {
            setApprovalTypeSeq('006')
        }
    }

    const hadleApprovalTitleChange = (e)=>{
       const {name, value} = e.target;
       setApprovalData(prev=>({...prev, [name]: value}))
    }

    const handleApprovalContentChange = (e) =>{
        const{name, value} = e.target;
        setApprovalData(prev=>({...prev,[name]: value}));
    }
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
                    <InputGroup className="mb-3">
                        <DropdownButton
                            variant="outline-secondary"
                            title="결재 구분"
                            id="input-group-dropdown-1"
                        >
                            <Dropdown.Item onClick={selectedData}>[001][서류 결재]</Dropdown.Item>
                            <Dropdown.Item href="#">[002][보고서 결재]</Dropdown.Item>
                            <Dropdown.Item href="#">[003][문서 결재]</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#">[004][예산 책정]</Dropdown.Item>
                            <Dropdown.Item href="#">[005][예산 결재]</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#">[006][휴가 신청]</Dropdown.Item>
                        </DropdownButton>
                        <Form.Control name="approval_title" aria-label="Text input with dropdown button" onChange={hadleApprovalTitleChange} value={approvalData.approval_Title}/>
                    </InputGroup>
                    <InputGroup name="approval_content" >
                        <Form.Control name="approval_contents" as="textarea" aria-label="With textarea" placeholder="내용을 입력하세요" onChange={handleApprovalContentChange} value={approvalData.approval_contents}/>
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

export default Approval;
