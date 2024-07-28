import styles from './MailItem.module.css'

const MailItem = ({mail}) => {

  

    return (
      <div className={styles.mailItem}>
            <div className={styles.mailInfo}>
                <div className={styles.mailSender}><span>{mail.sender}</span></div>
                <div className={styles.mailDate}><span>{mail.date}</span></div>
            </div>
            <div className={styles.mailSubject}>
                <span>{mail.subject}</span>
            </div>
        </div>
    )
  }

  export default MailItem;