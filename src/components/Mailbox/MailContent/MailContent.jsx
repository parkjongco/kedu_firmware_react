import { useNavigate } from 'react-router-dom';
import styles from './MailContent.module.css'
import { useMailStore } from '../../store/store';

const MailContent = () => {

  const {selectedMailContent} = useMailStore();
  const navigate = useNavigate();

  const handleReply = (mailId) => {
     // 회신 페이지로 이동하며 메일 ID를 전달
     navigate(`compose`, { state: { replyToMailId: mailId } });
  };


    return (
      <div className={styles.mailContainer}>

      {selectedMailContent.map((mail,index) => (
        <div key={index} className={styles.mail}>
        <h2>{mail.mail_title}</h2> {/* 메일제목 */}
            <div className={styles.contentHeader}>
              <div className={styles.contentInfo}><span>{mail.sender_name} (부서)<br></br>받는 사람</span></div>
              
              <div className={styles.contentButtons}>
              <button onClick={() => handleReply(mail.mail_seq)}>회신</button>
                <button>삭제</button>
              </div>
            </div>
            <div className={styles.mailContent}>
              <span>{mail.mail_content}</span> {/* 메일 내용 */}
            </div>
      </div>


      ))}



      
        {/* <div className={styles.mail}>
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
        </div> */}

      </div>
    )
  }

  export default MailContent;