import React, { useState } from 'react';
import styles from './index.module.css';
import SideBar from '../../../components/Jongho/SideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import NoticeCategoryComponent from '../../../config/NoticeCategory';

const NoticeIndex = () => {
    const [toggle, setToggle] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.sub_container}>
                { SideBar("https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg", "박종호", "fjqm212@gmail.com") }
                <div className={styles.category}>
                    <div className={styles.category_content}>
                        <h1>게시판</h1>
                        <NoticeCategoryComponent />
                    </div>
                </div>
                <div className={styles.content}>
                    {/* 카테고리 코드를 받고 해당 코드에 맞는 게시물을 불러온다. */}
                </div>
            </div>
        </div>
    );
};

export default NoticeIndex;
