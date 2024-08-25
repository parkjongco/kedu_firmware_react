import React, { useState } from 'react';
import styles from './index.module.css';
// import SideBar from '../../../components/Jongho/SideBar';
import SideBar from '../../../components/Sidebar/Sidebar';

import BoardPage from '../../../config/BoardCategory';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import List from '../List/List';
import BoardEdit from '../Edit/Edit';
import BoardDetail from '../Detail/Detail';

const Index = (host) => {
    const [selectedCategory, setSelectedCategory] = useState({});
    const navigate = useNavigate();

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    return (
        <div className={styles.container}>
            <div className={styles.sub_container}>
                {SideBar("https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg", "박종호", "fjqm212@gmail.com")}
                <div className={styles.category}>
                    <div className={styles.category_content}>
                        <h1>게시판</h1>
                        <BoardPage onChangeCategory={(e)=>{setSelectedCategory(e); navigate('./')}}  />
                    </div>
                </div>
                <div className={styles.content}>
                    <Routes>
                        <Route path='/' element={<List category={selectedCategory} />} />
                        {/* {2. 그리고 여기에 선택한 카테고리가 입력됨.} */}
                        <Route path='/Edit' element={<BoardEdit category={selectedCategory} />} />
                        {/* <Route path='Detail' element={<NoticeDetail />} /> */}
                        <Route path='/Detail/*' element={<BoardDetail />} /> 
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Index;
