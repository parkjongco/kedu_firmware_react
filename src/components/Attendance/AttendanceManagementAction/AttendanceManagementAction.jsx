import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import styles from './AttendanceManagementAction.module.css';
import { useAttendanceStore } from '../../../store/attendance_store';

const AttendanceManagementAction = () => {

    const {fetchAttendanceSummary, attendance, handleCheckIn, handleCheckOut } = useAttendanceStore();
    const [selected, setSelected] = useState(sessionStorage.getItem('selectedOption') || '내 근무');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isAfter6PM, setIsAfter6PM] = useState(false);

    const navi = useNavigate();

    const handleAttendanceManagement = () => {
        navi('/attendance');
    };

    const handleDeptSchedule = () => {
        navi('deptschedule');
    };

    const handleToggle = (option) => {
        setSelected(option);
        sessionStorage.setItem('selectedOption', option);
    }

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const checkIfAfter6PM = () => {
        const currentHour = new Date().getHours();
        setIsAfter6PM(currentHour >= 18);  // 오후 6시 이후인지 여부를 상태로 저장
    }

    useEffect(() => {
        checkIfAfter6PM();  // 컴포넌트가 마운트될 때 시간 확인
    }, []);

    // 퇴근 후 출석 요약 데이터를 갱신하는 함수
    const handleCheckOutAndUpdate = async () => {
        await handleCheckOut(); // 기존의 handleCheckOut 호출
        
        // 퇴근 후 출석 정보를 다시 가져와 업데이트
        const usersSeq = sessionStorage.getItem("usersSeq");
        const currentMonth = new Date().toISOString().slice(0, 7);
        fetchAttendanceSummary(usersSeq, currentMonth);
    }

    return (
        <div className={styles.container}>
            <div className={styles.toggleGroup}>
                <button
                    className={`${styles.toggleButton} ${selected === '내 근무' ? styles.selected : ''}`}
                    onClick={() => {handleToggle('내 근무'); handleAttendanceManagement();}}
                >
                    근태 현황
                </button>
                <button
                    className={`${styles.toggleButton} ${selected === '구성원 근무' ? styles.selected : ''}`}
                    onClick={() => {handleToggle('구성원 근무'); handleDeptSchedule();}}
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
                    <h2>출석 확인</h2>
                    <div className={styles.buttonContainer}>
                        {attendance.checkIn ? ( // checkIn 값이 있을 경우 퇴근 버튼을 보여줌
                            !attendance.checkOut ? ( // checkOut 값이 없을 경우 퇴근 버튼을 보여줌
                                <button className={styles.button} onClick={handleCheckOutAndUpdate}>퇴근</button>
                            ) : (
                                <p>이미 퇴근했습니다.</p> // checkOut 값이 있으면 퇴근한 상태임을 표시
                            )
                        ) : (
                            // 출석 버튼을 오후 6시 이전에만 활성화
                            !isAfter6PM ? (
                                <button className={styles.button} onClick={handleCheckIn}>출석</button>
                            ) : (
                                <p>오후 6시 이후에는 출석할 수 없습니다.</p>
                            )
                        )}
                    </div>
                    <div className={styles.status}>
                        <p>출근 시간: {attendance.checkIn ? new Date(attendance.checkIn).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '출근 한 상태가 아닙니다.'}</p>
                        <p>퇴근 시간: {attendance.checkOut ? new Date(attendance.checkOut).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '퇴근 하지 않았습니다.'}</p>
                    </div>
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
