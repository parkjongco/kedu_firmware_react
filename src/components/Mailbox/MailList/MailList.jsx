import { useEffect, useState } from 'react';
import MailItem from './MailItem/MailItem';
import styles from './MailList.module.css'
// import axios from 'axios';

const MailList = () => {

  // const mails = [
  //   { id: 1, sender: '작성자1', subject: '메일제목1', date: '작성 날짜1' },
  //   { id: 2, sender: '작성자2', subject: '메일제목2', date: '작성 날짜2' },
  //   // 해당 부분은 zustand사용하여 store로 이동하여야한다.(하드코딩 상태)
  // ];

  const [mails, setMails] = useState([]);

  
  // const handleGetAll = () => {
  //   console.log("모든 메일을 불러옵니다")
  //   axios.get(`http://192.168.1.36/mail`).then((resp) => { //객체배열 가져옴
  //     // console.log(resp.data); //객체 배열의 데이터만 콘솔 로그
  //     console.log("서버와 접근완료")
  //     setMails(resp.data);
  //   });
  // }

  // useEffect(()=>{
  //   handleGetAll();
  // }, []); //빈 배열을 전달하면 컴포넌트가 처음 마운트될 때 한번만 실행 됌


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
          {mails.map(mail => (
                <MailItem key={mail.id} mail={mail} />
            ))}
        </div>
      </div>
    )
  }

  export default MailList;