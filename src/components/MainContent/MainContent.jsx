import styles from './MainContent.module.css';

const MainContent = () => {
  return (
    <main className={styles.main_content}>
      <section className={styles.content}>
        <div className={styles.grid_container}>
          <div className={styles.grid_item}>이메일</div>
          <div className={styles.grid_item}>게시판</div>
          <div className={styles.grid_item}>전자결제</div>
          <div className={styles.grid_item}>캘린더</div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;