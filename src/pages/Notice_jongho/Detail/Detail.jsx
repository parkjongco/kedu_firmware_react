import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Detail.module.css';

const Detail = ({ category }) => {
    const navigate = useNavigate();
    // const { name, code } = category; // category의 속성을 구조 분해 할당

    return (
        <div className={styles.container}>
                <p>여기</p>
        </div>
    );
};

export default Detail;
