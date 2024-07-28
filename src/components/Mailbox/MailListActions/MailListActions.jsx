import styles from './MailListActions.module.css';
import { useNavigate } from 'react-router-dom';

const MailListActions = () => {
    const navi = useNavigate();

    return (
        <div className={styles.mailListActions}>
            <input type="text" placeholder="메일검색" />
            
            <button className={styles.refreshButton}>새로고침</button>
            <button className={styles.actionButtons} onClick={()=>{navi('compose')}}>메일쓰기</button>
            <button className={styles.actionButtons}>삭제</button>
            <button className={styles.actionButtons}>이동</button>
        </div>
    );
};

export default MailListActions;