import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faUser, faHome, faCalendar, faImagePortrait, faRightFromBracket, faEnvelope, faBarsStaggered, faFileInvoice, faMessage, faHardDrive } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import styles from './Sidebar.module.css';

export default function SideBar({ profile_src = "", username, useremail }) {
    const [toggle, setToggle] = useState(false);

    return (
        <div className={styles.sidebar} style={!toggle ? { width: "50px" } : {}}>
            <div className={styles.sidebar_container} style={!toggle ? { alignItems: "center" } : {}} >
                <div className={styles.icon} onClick={() => setToggle(!toggle)}>
                    <FontAwesomeIcon icon={faList} />
                </div>
                <div className={styles.company_name}>
                    {toggle && <h1>이름</h1>}
                </div>
                <div className={styles.user_info} style={!toggle ? { paddingLeft: "0px" } : {}}>
                    {
                        profile_src === "" &&
                        <div className={styles.user_img_box} style={!toggle ? { width: "21px", height: "21px" } : {}}>
                            <FontAwesomeIcon icon={faUser} className={styles.user_img} style={!toggle ? { width: "18px" } : {}} />
                        </div>
                    }
                    {
                        profile_src !== "" &&
                        <img src={profile_src} className={styles.user_img_box} style={!toggle ? { width: "21px", height: "21px" } : {}} />
                    }
                    {toggle &&
                        <>
                            <h1>{username}</h1>
                            <p>{useremail}</p>
                        </>
                    }
                </div>
                <div className={styles.side_group} style={!toggle ? { paddingLeft: "0px" } : {}}>
                    <div className={styles.side_list}>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faHome} />
                            {toggle && <a href="http://localhost:3000/" className={styles.link}>홈</a>}
                        </div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            {toggle && <a href="http://localhost:3000/mailbox" className={styles.link}>메일</a>}
                        </div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faBarsStaggered} />
                            {toggle && <a href="http://localhost:3000/Notice" className={styles.link}>게시판</a>}
                        </div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faCalendar} />
                            {toggle && <a href="캘린더" className={styles.link}>캘린더</a>}
                        </div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faFileInvoice} />
                            {toggle && <a href="전자결제" className={styles.link}>전자결제</a>}
                        </div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faMessage} />
                            {toggle && <a href="메신저" className={styles.link}>메신저</a>}
                        </div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faHardDrive} />
                            {toggle && <a href="자료실" className={styles.link}>자료실</a>}
                        </div>
                    </div>
                    <div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faImagePortrait} />
                            {toggle && <a href="자료실" className={styles.link}>자료실</a>}
                        </div>
                        <div className={styles.list_item}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            {toggle && <a href="로그아웃" className={styles.link}>로그아웃</a>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
