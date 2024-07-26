import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faUser, faHome, faCalendar, faImagePortrait, faRightFromBracket, faEnvelope, faBarsStaggered, faFileInvoice, faMessage, faHardDrive } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import styles from './index.module.css';


export default function SideBar (profile_src ="" , username, useremail) {
    const [toggle, setToggle] = useState(false);

    return (


    <div className={styles.sidebar} style={!toggle ? { width: "50px" } : {}}>
        <div className={styles.sidebar_container} style={!toggle ? { alignItems: "center" } : {}} >
            <div className={styles.icon} onClick={() => setToggle(!toggle)}>
                <FontAwesomeIcon icon={faList} />
            </div>
            <div className={styles.company_name}>
                {toggle && <h1>Firmware</h1>}
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
                        {toggle && <h3>홈</h3>}


                    </div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faEnvelope} />
                        {toggle && <h3>메일</h3>}

                    </div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faBarsStaggered} />
                        {toggle && <h3>게시판</h3>}

                    </div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faCalendar} />
                        {toggle && <h3>캘린더</h3>}

                    </div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faFileInvoice} />
                        {toggle && <h3>전자결제</h3>}

                    </div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faMessage} />
                        {toggle && <h3>메신저</h3>}

                    </div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faHardDrive} />
                        {toggle && <h3>자료실</h3>}

                    </div>
                </div>
                <div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faImagePortrait} />
                        {toggle && <h3>마이페이지</h3>}
                    </div>
                    <div className={styles.list_item}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        {toggle && <h3>로그아웃</h3>}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
