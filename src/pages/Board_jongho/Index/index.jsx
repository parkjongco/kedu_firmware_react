import React, { useState } from 'react';
import styles from './index.module.css';
import SideBar from '../../../components/Jongho/SideBar';
import BoardCategoryComponent from '../../../config/BoardCategory';
import { Link, Route, Routes } from 'react-router-dom';
import List from '../List/List';
import BoardEdit from '../Edit/Edit';
import BoardDetail from '../Detail/Detail';

const BoardIndex = (host) => {
    const [selectedCategory, setSelectedCategory] = useState({});

    return (
        <div className={styles.container}>
            <div className={styles.sub_container}>
                {SideBar("https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg", "박종호", "fjqm212@gmail.com")}
                <div className={styles.category}>
                    <div className={styles.category_content}>
                        <h1>게시판</h1>
                        <BoardCategoryComponent onCategoryClick={setSelectedCategory} />
                    </div>
                </div>
                <div className={styles.navigation}>
                    <Link to="/Board">List</Link>
                    <Link to="/Board/Edit">Edit</Link>
                    <Link to="/Board/Detail">Detail</Link>
                </div>
                <div className={styles.content}>
                    <Routes>
                        <Route path='' element={<List category={selectedCategory} />} />
                        <Route path='Edit' element={<BoardEdit />} />
                        {/* <Route path='Detail' element={<NoticeDetail />} /> */}
                        <Route path='Detail/*' element={<BoardDetail />} /> 
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default BoardIndex;
