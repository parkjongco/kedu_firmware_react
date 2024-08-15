import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import styles from './AttendanceCardBox.module.css';
import { useAttendanceStore } from '../../../store/attendance_store';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const AttendanceCardBox = () => {
    // 현재 선택된 월을 관리하는 state, 초기값은 현재 년-월로 설정
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    // 출석 데이터 상태를 관리하는 zustand 훅 사용
    const { attendanceData, fetchAttendanceSummary } = useAttendanceStore();

    // 선택된 월이 변경될 때마다 출석 데이터를 서버에서 가져옴
    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const usersSeq = sessionStorage.getItem("usersSeq"); // 사용자 ID를 세션에서 가져옴
                await fetchAttendanceSummary(usersSeq, selectedMonth); // 상태 업데이트 호출
            } catch (error) {
                console.error('Error fetching attendance data:', error); // 에러 발생 시 콘솔에 출력
            }
        };

        fetchAttendanceData(); // 데이터 가져오는 함수 호출
    }, [selectedMonth, fetchAttendanceSummary]); // 선택된 월이 변경될 때마다 useEffect 재실행

    // 월 선택을 변경하는 함수
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value); // 선택된 월을 state에 반영
    };

    return (
        <div className={styles.Container}>
            {/* 월 선택 input */}
            <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className={styles.MonthInput}
            />
            {/* 출석 정보 카드들 */}
            <div className={styles.CardDiv}>
                <Card className={styles.Card}>
                    <Card.Body>
                        <h6>출석 일수</h6>
                        <h3>{attendanceData.daysPresent}일</h3> {/* 출석 일수 표시 */}
                    </Card.Body>
                </Card>
                <Card className={styles.Card}>
                    <Card.Body>
                        <h6>지각</h6>
                        <h3>{attendanceData.daysLate}일</h3> {/* 지각 일수 표시 */}
                    </Card.Body>
                </Card>
                <Card className={styles.Card}>
                    <Card.Body>
                        <h6>결근</h6>
                        <h3>{attendanceData.daysAbsent}일</h3> {/* 결근 일수 표시 */}
                    </Card.Body>
                </Card>
                <Card className={styles.Card}>
                    <Card.Body>
                        <h6>조퇴</h6>
                        <h3>{attendanceData.earlyLeave > 0 ? `${attendanceData.earlyLeave}일` : '없음'}</h3> {/* 조퇴 일수 표시 */}
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default AttendanceCardBox;
