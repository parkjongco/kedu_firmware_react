import { useEffect, useState } from 'react';
import MailItem from './MailItem/MailItem';
import styles from './MailList.module.css'
import axios from 'axios';
import { useMailStore } from '../../../store/mail_store';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const MailList = () => {

  const { mails, handleGetAll, setSelectedMailContent, setSelectedMailSeq, handleGetPage } = useMailStore();


  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const mailsPerPage = 10; // 페이지당 메일 수
  const [currentMails, setCurrentMails] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태 관리
  const [sortOption, setSortOption] = useState('date_desc'); // 정렬 옵션 상태

  // 페이지 번호 변경 시 메일 목록 업데이트
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{
    // console.log("useEffect 호출됨");
    handleGetAll();
  }, []); //빈 배열을 전달하면 컴포넌트가 처음 마운트될 때 한번만 실행 됌

  useEffect(() => {
    console.log("useEffect 호출됨");
    handleGetPage(currentPage, mailsPerPage); // 페이지 및 항목 수를 전달
  }, [currentPage]); // currentPage 변경 시마다 호출
  
  useEffect(() => {
    if (mails && Array.isArray(mails.mails)) {
      let sortedMails = [...mails.mails];

      // 정렬 옵션에 따른 정렬 및 필터링 로직
      switch (sortOption) {
        case 'date_asc':
          sortedMails.sort((a, b) => new Date(a.mail_received_date) - new Date(b.mail_received_date));
          break;
        case 'date_desc':
          sortedMails.sort((a, b) => new Date(b.mail_received_date) - new Date(a.mail_received_date));
          break;
        case 'my_mails':
          sortedMails = sortedMails.filter(mail => mail.mail_sender_user_seq === sessionStorage.getItem("userSeq"));
          break;
        default:
          break;
      }

      setCurrentMails(sortedMails);
      setTotalPages(Math.ceil(mails.total / mailsPerPage));
      setSelectedMailContent([])
    }
  }, [mails, sortOption]);


  useEffect(() => {
    console.log("mails 상태 업데이트 감지:", mails);
    if (mails && Array.isArray(mails.mails)) { // mails가 객체이고 mails.mails가 배열인지 확인
      setCurrentMails(mails.mails);
      setTotalPages(Math.ceil(mails.total / mailsPerPage)); // mails.total 사용
      console.log("currentMails 설정됨:", mails.mails);
      console.log(mails.total);
      console.log("Total pages:", Math.ceil(mails.total / mailsPerPage));
    }
  }, [mails]);
  
  

  const handleMailClick = (mailSeq) => {
    
    setSelectedMailSeq(mailSeq); // 선택된 메일의 Seq를 저장(삭제에서 사용)
    console.log("선택된 메일 Seq는" + mailSeq);
    // console.log(`메일 제목: ${mailTitle}을(를) 서버로 전송합니다.`);
    axios.get(`${serverUrl}/mail`, {
      params: { seq: mailSeq }
    }).then((resp) => {
      console.log("받은 메일 내용:", resp.data);
      setSelectedMailContent(resp.data); // 서버로부터 받은 메일 내용을 상태에 저장
      
      
    });
  };

  
  return (
    <div className={styles.mailContainer}>
      <div className={styles.sortButtons}>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="date_desc">최신순</option>
          <option value="date_asc">오래된 순</option>
          <option value="my_mails">작성한 메일</option>
        </select>
      </div>
      <div className={styles.mailList}>
        {currentMails.map((mail) => (
          // <MailItem key={`${mail.mail_seq}-${mail.mailbox_seq}`} // 복합 키 사용 (확장 기능에서 필요해진다면)
          <MailItem key={mail.mail_seq}
           mail={mail} onClick={() => handleMailClick(mail.mail_seq)}/>
        ))}
      </div>

      <div className={styles.pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i + 1} 
            onClick={() => handlePageChange(i + 1)}
            className={i + 1 === currentPage ? styles.active : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
  }

  export default MailList;