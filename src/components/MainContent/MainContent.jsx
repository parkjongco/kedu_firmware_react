import styles from './MainContent.module.css';
import MainCalendar from './MainCalendar/MainCalendar';  // 새로 추가된 컴포넌트 임포트
import React, { useEffect, useState } from 'react';
import MainBoard from '../MainBoard/MainBoard';


const MainContent = (category) => {
  return (
    <main className={styles.main_content}>
      <section className={styles.content}>
        <div className={styles.left_column}>
          <MainCalendar />  {/* 기존 캘린더 코드를 이 컴포넌트로 대체 */}
          <div className={styles.notice}>
            <MainBoard  category={category} />
        
          </div>
        </div>
        <div className={styles.right_column}>
          <div className={styles.attendance}>
            <h2>출근 현황</h2>
            <div className={styles.attendance_item}>
              <div className={styles.attendance_label}>홍길동</div>
              <div className={styles.attendance_status}>출근 완료</div>
              <div className={styles.attendance_time}>08:30</div>
            </div>
            <div className={styles.attendance_item}>
              <div className={styles.attendance_label}>이영희</div>
              <div className={styles.attendance_status}>출근 완료</div>
              <div className={styles.attendance_time}>09:00</div>
            </div>
            <div className={styles.attendance_item}>
              <div className={styles.attendance_label}>김철수</div>
              <div className={styles.attendance_status}>지각</div>
              <div className={styles.attendance_time}>09:20</div>
            </div>
          </div>
          <div className={styles.vacation}>
            <h2>휴가 현황</h2>
            <div className={styles.vacation_item}>
              <div className={styles.vacation_label}>홍길동</div>
              <div className={styles.vacation_days}>잔여 휴가: 10일</div>
            </div>
            <div className={styles.vacation_item}>
              <div className={styles.vacation_label}>이영희</div>
              <div className={styles.vacation_days}>잔여 휴가: 5일</div>
            </div>
            <div className={styles.vacation_item}>
              <div className={styles.vacation_label}>김철수</div>
              <div className={styles.vacation_days}>잔여 휴가: 7일</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
