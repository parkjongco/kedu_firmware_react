import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './AttendanceCardBox.module.css';

const AttendanceCardBox = () => {
    return (
        <div className={styles.CardDiv}>
            <Card className={styles.Card}>
                <Card.Body>
                    <h6>이번 달 출석 일수</h6>
                    <h3>12일</h3>
                </Card.Body>
            </Card>
            <Card className={styles.Card}>
                <Card.Body>
                    <h6>이번 달 사용 휴가</h6>
                    <h3>2일</h3>
                </Card.Body>
            </Card>
            <Card className={styles.Card}>
                <Card.Body>
                    <h6>결근</h6>
                    <h3>3일</h3>
                </Card.Body>
            </Card>
            <Card className={styles.Card}>
                <Card.Body>
                    <h6>조퇴</h6>
                    <h3>없음</h3>
                </Card.Body>
            </Card>
        </div>
    );
}

export default AttendanceCardBox;
