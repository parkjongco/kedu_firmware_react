import styles from './MailItem.module.css'

const MailItem = ({mail, onClick}) => {

    // 메일 보낸 사람 정보 받기 구현 예정
    // const [senderNames, setSenderName] = useState('');

    // useEffect(()=> {
    //     //메일 발신자의 이름을 가져온다.
    //     const fetchSenderName = () =>{
    //         axios.get(`http://192.168.1.36/users/${mail.mail_sender_user_seq}`)
    //     }
    // })

    return (
        <div className={styles.mailItem} onClick={() => onClick(mail.mail_seq)}>
            <div className={styles.mailInfo}>
                <div className={styles.mailSender}>
                <span>{mail.mail_sender_user_seq}</span> {/* 발신자 ID */}
                </div>
                <div className={styles.mailDate}>
                <span>{mail.mail_received_date}</span> {/* 받은 날짜 */}
                </div>
            </div>
            <div className={styles.mailSubject}>
                <span>{mail.mail_title}</span> {/* 메일 제목 */}
            </div>
        </div>
    )
  }

  export default MailItem;