import React, { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import styles from './MainBoard.module.css'; // 스타일 파일

const MainBoard = () => {
    const [data, setData] = useState([]);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useLayoutEffect(() => {
        // 서버에서 데이터 가져오기
        axios.get(`${serverUrl}:3000/board/0`)
            .then(response => { 
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [setData]);
    console.log(data);

    return (
        <div className={styles.mainBoard}>
            <h2>공지사항</h2>
            <ul>
                {data.map(item => (
                    <li key={item.board_seq}>
                        <a href={`/Board/Detail/${item.board_seq}`}>{item.board_title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MainBoard;
