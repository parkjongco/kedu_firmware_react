import React, { useState } from 'react';
import styles from './index.module.css';
import SideBar from '../../../components/Jongho/SideBar';
import NoticeCategoryComponent from '../../../config/NoticeCategory';
import { Link, Route, Routes } from 'react-router-dom';
import List from '../List/List';
import NoticeEdit from '../Edit/Edit';
import NoticeDetail from '../Detail/Detail';

const NoticeIndex = () => {
    const [selectedCategory, setSelectedCategory] = useState({});

    return (
        <div className={styles.container}>
            <div className={styles.sub_container}>
                {SideBar("https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg", "박종호", "fjqm212@gmail.com")}
                <div className={styles.category}>
                    <div className={styles.category_content}>
                        <h1>게시판</h1>
                        <NoticeCategoryComponent onCategoryClick={setSelectedCategory} />
                    </div>
                </div>
                <div className={styles.navigation}>
                    <Link to="/Notice">List</Link>
                    <Link to="/Notice/Edit">Edit</Link>
                    <Link to="/Notice/Detail">Detail</Link>
                </div>
                <div className={styles.content}>
                    <Routes>
                        <Route path='' element={<List category={selectedCategory} />} />
                        <Route path='Edit' element={<NoticeEdit />} />
                        {/* <Route path='Detail' element={<NoticeDetail />} /> */}
                        <Route path='Detail' element={<NoticeDetail />} /> 
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default NoticeIndex;
