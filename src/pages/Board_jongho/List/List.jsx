import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './List.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../../store/store';

axios.defaults.withCredentials = true
export const List = ({ category = {} }) => {
    const { usersName } = useAuthStore(); 
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('default');
    const itemsPerPage = 10;
    const [isUserName ,setUserName] =  useState( () =>sessionStorage.getItem("userName") ==='true' ) ;

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const session = sessionStorage.getItem("usersName");
    useEffect(() => {
        // console.log("현재 유저 이름:", session.getItem("usersName")); // 현재 유저 이름을 콘솔에 출력
        axios.get(`${serverUrl}/board`)
            .then(resp => {
                setData(resp.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [serverUrl, usersName]);

    const sortedData = () => {
        return [...data].sort((a, b) => {
            const dateA = new Date(a.board_write_date);
            const dateB = new Date(b.board_write_date);

            switch (sortOrder) {
                case 'viewCount':
                    return b.board_view_count - a.board_view_count;
                case 'latest':
                    return dateB - dateA;
                case 'default':
                default:
                    return a.board_seq - b.board_seq;
            }
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData().slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (seq) => {
        navigate(`/Board/Detail/${seq}`);
    };

    const handleToggleSort = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handleDelete = (seq) => {
        axios.delete(`${serverUrl}/board/${seq}`, { withCredentials: true })
            .then(() => {
                setData(data.filter(item => item.board_seq !== seq));
            })
            .catch(error => {
                console.error('Error deleting data:', error);
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.category_header}>
                <div className={styles.headerLeft}>
                    <h2>{category.name || 'Default Category'}</h2>
                </div>
                <div className={styles.header_Right}>
                    <Link id={styles.write} to="Edit">등록하기</Link>
                    <div className={styles.sortButtons}>
                        <button 
                            className={sortOrder === 'default' ? styles.active : ''} 
                            onClick={() => handleToggleSort('default')}
                        >
                            기본순
                        </button>
                        <button 
                            className={sortOrder === 'latest' ? styles.active : ''} 
                            onClick={() => handleToggleSort('latest')}
                        >
                            최신순
                        </button>
                        <button 
                            className={sortOrder === 'viewCount' ? styles.active : ''} 
                            onClick={() => handleToggleSort('viewCount')}
                        >
                            조회수순
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <table>
                    <thead>
                        <tr>
                            <th>제목</th>
                            <th>글쓴이</th>
                            <th>작성일자</th>
                            <th>조회수</th>
                            <th>액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((e) => (
                            <tr key={e.board_seq} onClick={() => handleRowClick(e.board_seq)} className={styles.row}>
                                <td>{e.board_title}</td>
                                <td>{session || '작성자 정보 없음'}</td> {/* 사용자 이름을 표시 */}
                                <td>{new Date(e.board_write_date).toLocaleString()}</td>
                                <td>{e.board_view_count}</td>
                                <td>
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        handleDelete(e.board_seq);
                                    }}>
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? styles.active : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default List;
