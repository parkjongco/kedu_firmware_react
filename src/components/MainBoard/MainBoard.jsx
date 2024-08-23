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
            <table>
                <thead>
                    <tr>
                        <td>[공지]</td>
                        <th>제목</th>
                        <th>작성일자</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.board_seq}>
                            <td>[공지]</td>
                       
                            <td> <a href={`/Board/Detail/${item.board_seq}`}>{item.board_title}</a> </td>
                            <td><a href={`/Board/Detail/${item.board_seq}`}>{new Date(item.board_write_date).toLocaleString()}</a></td>
                            <td><a href={`/Board/Detail/${item.board_seq}`}>{item.board_view_count}</a></td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default MainBoard;
