// src/config/NoticeCategory.js
import React, { useEffect, useState } from 'react';
import styles from './NoticeCategory.module.css';

export const NoticeCategory = [
    { code: 0, name: "전사 게시판" },
    { code: 1, name: "공지사항" },
    { code: 2, name: "자유게시판" },
    { code: 3, name: "갤러리" },
    { code: 4, name: "메이플 갤러리" },
    { code: 5, name: "퇴사 갤러리" }
];

const NoticeCategoryComponent = ({ onCategoryClick } ) => {
    const [init, setInit] = useState(false);

    useEffect(()=> {
        if(!init) {
            onCategoryClick(NoticeCategory[0]);
            setInit(!init);
        }
    })

    return (
        <div className={styles.noticeCategories}>
            {NoticeCategory.map(category => (
                <div
                    key={category.code}
                    className={styles.category}
                    data-code={category.code}
                    onClick={() => onCategoryClick(category)}
                >
                    {category.name}
                </div>
            ))}
        </div>
    );
    useEffect(()=> {
        onCategoryClick(NoticeCategory[0])
    });
};

export default NoticeCategoryComponent;
