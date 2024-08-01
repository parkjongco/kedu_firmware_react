import { useEffect, useState } from 'react';
import MailItem from './MailItem/MailItem';
import styles from './MailList.module.css'
import axios from 'axios';
import { useMailStore } from '../../store/store';

const MailList = () => {

  // const mails = [
  //   { id: 1, sender: '작성자1', subject: '메일제목1', date: '작성 날짜1' },
  //   { id: 2, sender: '작성자2', subject: '메일제목2', date: '작성 날짜2' },
  //   // 해당 부분은 zustand사용하여 store로 이동하여야한다.(하드코딩 상태)
  // ];

  // const [mails, setMails] = useState([]);
  // const [selectedMailContent, setSelectedMailContent] = useState(null); // 선택된 메일 내용
  // const [selectedMailSeq, setSelectedMailSeq] = useState(null);

  const { mails, handleGetAll, setSelectedMailContent, setSelectedMailSeq } = useMailStore();


  

  const handleMailClick = (mailSeq) => {
    
    setSelectedMailSeq(mailSeq); // 선택된 메일의 Seq를 저장(삭제에서 사용)
    console.log("선택된 메일 Seq는" + mailSeq);
    // console.log(`메일 제목: ${mailTitle}을(를) 서버로 전송합니다.`);
    axios.get(`http://192.168.1.36/mail`, {
      params: { seq: mailSeq }
    }).then((resp) => {
      console.log("받은 메일 내용:", resp.data);
      setSelectedMailContent(resp.data); // 서버로부터 받은 메일 내용을 상태에 저장
      
      
    });
  };

  

  useEffect(()=>{
    console.log("useEffect 호출됨");
    handleGetAll();
  }, []); //빈 배열을 전달하면 컴포넌트가 처음 마운트될 때 한번만 실행 됌


    return (
      <div className={styles.mailContainer}>
        <div className={styles.sortButtons}>
          <select>
            <option value="date">날짜순</option>
            <option value="sender">보낸사람순</option>
            <option value="subject">제목순</option>
          </select>
        </div>
        <div className={styles.mailList}> {/*해당부분 CSS 추가 적용 필요해보임 */}
        {mails.map((mail) => (
          <MailItem key={mail.mail_seq} mail={mail} onClick={handleMailClick}/>
        ))}

        </div>
      </div>
    )
  }

  export default MailList;