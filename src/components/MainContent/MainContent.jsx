import MainAttendance from './MainAttendance/MainAttendance';
import styles from './MainContent.module.css';
import MainVacation from './MainVacation/MainVacation';

const MainContent = () => {
  return (
    <main className={styles.main_content}>
      <section className={styles.content}>
        <div className={styles.left_column}>
          <div className={styles.calendar}>
            <h2>내 캘린더 일정</h2>
            <div className={styles.calendar_item}>
              <div className={styles.date}>2024-08-23</div>
              <div className={styles.event}>팀 회의</div>
              <div className={styles.time}>14:00 - 16:00</div>
            </div>
            <div className={styles.calendar_item}>
              <div className={styles.date}>2024-08-24</div>
              <div className={styles.event}>클라이언트 미팅</div>
              <div className={styles.time}>11:00 - 12:00</div>
            </div>
            <div className={styles.calendar_item}>
              <div className={styles.date}>2024-08-25</div>
              <div className={styles.event}>연차 휴가</div>
              <div className={styles.time}>종일</div>
            </div>
          </div>
          <div className={styles.notice}>
            <h2>공지사항</h2>
            <div className={styles.notice_item}>
              <div className={styles.category}>[공지]</div>
              <div className={styles.title}>사내 교육 일정 안내</div>
              <div className={styles.notice_date}>2024-08-22</div>
            </div>
            <div className={styles.notice_item}>
              <div className={styles.category}>[공지]</div>
              <div className={styles.title}>연말 행사 안내</div>
              <div className={styles.notice_date}>2024-08-20</div>
            </div>
            <div className={styles.notice_item}>
              <div className={styles.category}>[공지]</div>
              <div className={styles.title}>휴가 계획 제출 요청</div>
              <div className={styles.notice_date}>2024-08-18</div>
            </div>
          </div>
        </div>
        <div className={styles.right_column}>
          <div className={styles.attendance}>
            {/* 출근 현황 */}
            <MainAttendance/>
            {/*  */}
          </div>
          <div className={styles.vacation}>
            {/* 휴가 현황 */}
            <MainVacation/>
            {/*  */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
