import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../../store/store';
import styles from './List.module.css';
import { Link } from 'react-router-dom';


axios.defaults.withCredentials = true;

export const List = ({ category = {} }) => {
    const { usersName, isAdmin } = useAuthStore();
    const [data, setData] = useState([]);
    const [currentCategory, setCurrentCategory] = useState({ category_seq: 0, category_name: '공지사항' }); // 기본 카테고리 설정

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('latest');
    const [selectedItems, setSelectedItems] = useState([]);
    const itemsPerPage = 10;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        // 초기 로드 또는 카테고리 변경 시 데이터 로드
        const fetchCategory = category.category_seq ? category : { category_seq: 0, category_name: '공지사항' };

        axios.get(`${serverUrl}:3000/board/${fetchCategory.category_seq}`)
            .then(response => {
                setCurrentCategory(fetchCategory);
                setData(response.data);
                setSelectedItems([]); // Clear selected items on category change
                setCurrentPage(1); // Reset to first page
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [serverUrl, category]); // 'category' 변경 시에도 실행되도록

    const sortedData = () => {
        return [...data].sort((a, b) => {
            const dateA = new Date(a.board_write_date);
            const dateB = new Date(b.board_write_date);

            switch (sortOrder) {
                case 'viewCount':
                    return b.board_view_count - a.board_view_count;
                case 'latest':
                    return dateB - dateA;
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
        axios.put(`${serverUrl}:3000/board/viewCount`, { board_Seq: seq })
            .then(() => {
                navigate(`/Board/Detail/${seq}`);
            })
            .catch(error => {
                console.error('Error increasing view count:', error);
                navigate(`/Board/Detail/${seq}`);
            });
    };

    const handleToggleSort = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handleCheckboxChange = (seq) => {
        setSelectedItems(prevState =>
            prevState.includes(seq) ? prevState.filter(item => item !== seq) : [...prevState, seq]
        );
    };

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            selectedItems.forEach(seq => {
                axios.delete(`${serverUrl}:3000/board/${seq}`)
                    .then(() => {
                        setData(data.filter(item => item.board_seq !== seq));
                        setSelectedItems(prevItems => prevItems.filter(item => item !== seq));
                    })
                    .catch(error => {
                        console.error('Error deleting data:', error);
                    });
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.categoryHeader}>
                <div className={styles.headerLeft}>
                    <h2>{currentCategory.category_name || '공지사항'}</h2>
                </div>
                <div className={styles.headerRight}>
                    {isAdmin && (
                        <Link id={styles.write} to="Edit">등록하기</Link>
                    )}
                    <div className={styles.sortButtons}>
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
                        {isAdmin && (
                            <button
                                className={styles.deleteButton}
                                onClick={handleDelete}
                                disabled={selectedItems.length === 0}
                            >
                                선택된 항목 삭제
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <table>
                    <thead>
                        <tr>
                            {isAdmin && <th>선택</th>}
                            <th>제목</th>
                            <th>글쓴이</th>
                            <th>작성일자</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(e => (
                            <tr
                                key={e.board_seq}
                                className={styles.row}
                                onClick={() => handleRowClick(e.board_seq)}
                            >
                                {isAdmin && (
                                    <td className={styles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(e.board_seq)}
                                            onChange={() => handleCheckboxChange(e.board_seq)}
                                            onClick={(event) => event.stopPropagation()}
                                        />
                                    </td>
                                )}
                                <td>{e.board_title}</td>
                                <td>{e.users_name || '작성자 정보 없음'}</td>
                                <td>{new Date(e.board_write_date).toLocaleString()}</td>
                                <td>{e.board_view_count}</td>
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
