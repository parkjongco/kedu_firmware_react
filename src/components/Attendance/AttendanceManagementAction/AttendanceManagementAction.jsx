import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './AttendanceManagementAction.module.css';
import { useAttendanceStore } from '../../../store/attendance_store';

const AttendanceManagementAction = () => {

    const {attendance, handleCheckIn, handleCheckOut, hasCheckedIn} = useAttendanceStore();

    const [selected, setSelected] = useState('내 근무');
    const [modalIsOpen, setModalIsOpen] = useState(false);




    const handleToggle = (option) => {
        setSelected(option);
    }

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }


    return (
        <div className={styles.container}>
            <div className={styles.toggleGroup}>
                <button
                    className={`${styles.toggleButton} ${selected === '내 근무' ? styles.selected : ''}`}
                    onClick={() => handleToggle('내 근무')}
                >
                    근태 현황
                </button>
                <button
                    className={`${styles.toggleButton} ${selected === '구성원 근무' ? styles.selected : ''}`}
                    onClick={() => handleToggle('구성원 근무')}
                >
                    구성원 근무
                </button>
            </div>
            
            <Button className={styles.registerButton} onClick={openModal}>출석체크</Button>

            <Modal show={modalIsOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>출석 체크</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                    <h2>출석 확인</h2>
                    <div className={styles.buttonContainer}>
                        {!hasCheckedIn ? (
                            <button className={styles.button} onClick={handleCheckIn}>출석</button>
                        ) : (
                            <button className={styles.button} onClick={handleCheckOut}>퇴근</button>
                        )}
                    </div>
                    <div className={styles.status}>
                        <p>출근 상황: {attendance.checkIn || '출근 한 상태가 아닙니다.'}</p>
                        <p>퇴근 상황: {attendance.checkOut || '퇴근 하지 않았습니다.'}</p>
                    </div>



                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>닫기</Button>
                    <Button variant="primary" onClick={closeModal}>확인</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AttendanceManagementAction;
