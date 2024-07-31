import styles from './MailContent.module.css'

const MailContent = () => {
    return (
      <div className={styles.mailContainer}>
        <div className={styles.mail}>
          <h2>메일 제목</h2>
              <div className={styles.contentHeader}>
                <div className={styles.contentInfo}><span>성함 (부서)<br></br>받는 사람</span></div>
                
                <div className={styles.contentButtons}>
                  <button>회신</button>
                  <button>전달</button>
                  <button>신고</button>
                </div>
              </div>
              <div className={styles.mailContent}>
                <span>메일 내용</span>
              </div>
        </div>
      
        <div className={styles.mail}>
          <h2>메일 제목</h2>
              <div className={styles.contentHeader}>
                <div className={styles.contentInfo}><span>성함 (부서)<br></br>받는 사람</span></div>
                
                <div className={styles.contentButtons}>
                  <button>회신</button>
                  <button>전달</button>
                  <button>신고</button>
                </div>
              </div>
              <div className={styles.mailContent}>
                <span>메일 내용</span>
              </div>
        </div>

      </div>
    )
  }

  export default MailContent;