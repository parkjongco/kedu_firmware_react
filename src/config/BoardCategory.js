// src/config/BoardCategory.js
import React, { useEffect, useState } from 'react';
import styles from './BoardCategory.module.css';

export const BoardCategory = [
    { code: 0, name: "공지사항" },
    { code: 1, name: "팀 게시판" },
    { code: 2, name: "프로젝트 게시판" },
    { code: 3, name: "자유게시판" },
    { code: 4, name: "질문 및 답변 게시판" },
    { code: 5, name: "자료실" },
    { code: 6, name: "회의록 게시판" },
];

const BoardCategoryComponent = ({ onCategoryClick }) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!init) {
            onCategoryClick(BoardCategory[0]);
            setInit(!init);
        }
    });

    return (
        <div className={styles.boardCategories}>
            {BoardCategory.map(category => (
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
};

export default BoardCategoryComponent;
