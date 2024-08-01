import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Detail.module.css';

const Detail = () => {
    const [board, setBoard] = useState(null);
    const location = useLocation();

    const seq = location.pathname.substring(location.pathname.lastIndexOf("/") + 1, location.pathname.length);

    // React 컴포넌트에서 요청 URL 확인
    useEffect(() => {
        console.log(`Fetching data for seq: ${seq}`); // seq 값 확인
        axios.get(`http://localhost:80/board/detail/${seq}`)
            .then(resp => {
                console.log('Data fetched successfully:', resp.data); // 데이터 확인
                setBoard(resp.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error); // 에러 확인
            });

            
    }, [seq]);

    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}><strong>제목:</strong>{board.board_title}</div>
            </div>
            <div className={styles.content}>
                <div><strong>글쓴이:</strong> {board.writer}</div>
                <div><strong>작성일자:</strong> {new Date(board.board_write_date).toLocaleString()}</div>
                <div><strong>조회수:</strong> {board.board_view_count}</div>
                <div dangerouslySetInnerHTML={{ __html : board.board_contents}}></div>
            </div>
        </div>
    );
};

export default Detail;
