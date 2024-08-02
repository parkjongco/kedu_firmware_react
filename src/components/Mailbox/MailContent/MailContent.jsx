import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './MailContent.module.css'
import { useMailStore } from '../../store/store';
import axios from 'axios';

const MailContent = () => {

  const {selectedMailContent, selectedMailSeq, setSelectedMailContent, handleGetAll} = useMailStore();
  const navigate = useNavigate();

  const handleReply = (mailId) => {
     // 회신 페이지로 이동하며 메일 ID를 전달
     navigate(`compose`, { state: { replyToMailId: mailId } });
  };


  //삭제하고 삭제된 메일을 제외한 content를 보여줘야한다
  const handleDeleteSelectedMail = (mailId) => {
    console.log("삭제요청")
      
      console.log("현재 선택된 메일 Seq: " + mailId);
      axios.delete(`http://192.168.1.36/mail/${mailId}`).then(() => {
        handleGetAll();
      }).then(() => {
        axios.get(`http://192.168.1.36/mail`, {
          params: { seq: selectedMailSeq }
        }).then((resp) => {
          setSelectedMailContent(resp.data);
        })
      })
      
    };


//회신을 하고 돌아왔을때 mailContent 내용을 갱신해준다.
//mailContent는 메일함 목록을 눌렀을때 갱신이되기때문에
//회신 이후에 바로 회신 메일을 확인을 확인해주기위해 아래와같은 처리를 해줌
useEffect(() => {
  if (selectedMailSeq) {//selectedMailSeq가 있을 경우만 실행
    axios.get(`http://192.168.1.36/mail`, {
      params: { seq: selectedMailSeq }
    }).then((resp) => {
      setSelectedMailContent(resp.data); // 메일 내용 설정
    });
  }
}, [selectedMailSeq]); // selectedMailSeq가 변경될 때마다 실행

// 데이터가 없을 때 예외 처리
if (!selectedMailContent || !Array.isArray(selectedMailContent.mails) || selectedMailContent.mails.length === 0) {
  return <div className={styles.mailContainer}>메일을 선택해 주세요</div>;
}


    return (
      <div className={styles.mailContainer}>

      {selectedMailContent.mails.map((mail,index) => (
        <div key={index} className={styles.mail}>
        <h2>{mail.mail_title}</h2> {/* 메일제목 */}
            <div className={styles.contentHeader}>
              <div className={styles.contentInfo}><span>{mail.sender_name} (부서)<br></br>받는 사람</span></div>
              
              <div className={styles.contentButtons}>
              <button onClick={() => handleReply(mail.mail_seq)}>회신</button>
              {index !== selectedMailContent.mails.length - 1 && ( //가장 오래전 메일(목록에 표시되는메일)은 content영역에서 삭제 불가(action 컴포넌트의 삭제에서 삭제해야함)
                <button onClick={() => handleDeleteSelectedMail(mail.mail_seq)}>삭제</button>
              )} 
              </div>
            </div>
            <div className={styles.mailContent}>
              <span>{mail.mail_content}</span> {/* 메일 내용 */}
            </div>
      </div>
      
        
      ))}



      
        

      </div>
    )
  }

  export default MailContent;