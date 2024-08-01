import styles from './MailListActions.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMailStore } from './../../store/store';

const MailListActions = () => {
    const navi = useNavigate();
    const { setSelectedMailContent, selectedMailSeq, setSelectedMailSeq, handleGetAll } = useMailStore();

    //현재 선택되어있는 메일함 전체 삭제
    const handleDeleteSelectedMailBox = () => {
        if (!selectedMailSeq) {
            alert("선택된 메일함이 없습니다.");
            console.log("선택된 메일함이 없습니다.");
            return;
        }
        console.log("현재 선택된 메일 Seq: " + selectedMailSeq);
        axios.delete(`http://192.168.1.36/mailbox/${selectedMailSeq}`).then(() => {
          handleGetAll();
        }).then(() => {
            axios.get(`http://192.168.1.36/mail`, {
              params: { seq: selectedMailSeq }
            }).then((resp) => {
              setSelectedMailContent(resp.data);
              setSelectedMailSeq(null);
            })
          })
      };
    
    const handleComposeMail = () => {
        navi('compose');
    };


    return (
        <div className={styles.mailListActions}>
            <input type="text" className={styles.searchInput} placeholder="메일검색" autoComplete="off" maxLength="100" />
            
            <button className={styles.refreshButton} onClick={handleGetAll}>새로고침</button>
            <button className={styles.actionButtons} onClick={handleComposeMail}>메일쓰기</button>
            <button className={styles.actionButtons} onClick={handleDeleteSelectedMailBox}>삭제</button>
            {/* <button className={styles.actionButtons}>이동</button> */}
        </div>
    );
};

export default MailListActions;