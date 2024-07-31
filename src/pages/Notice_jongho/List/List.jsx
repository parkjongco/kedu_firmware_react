import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './List.module.css';
import { Link } from 'react-router-dom';

const dummy = [
    { "num": 1, "title": "게시물 제목 1", "writer": "홍길동", "reg_date": "2024-07-29", "view_cnt": 120 },
    { "num": 2, "title": "게시물 제목 2", "writer": "김철수", "reg_date": "2024-07-28", "view_cnt": 98 },
    { "num": 3, "title": "게시물 제목 3", "writer": "이영희", "reg_date": "2024-07-27", "view_cnt": 76 },
    { "num": 4, "title": "게시물 제목 4", "writer": "박종호", "reg_date": "2024-07-26", "view_cnt": 150 },
    { "num": 5, "title": "게시물 제목 5", "writer": "최영수", "reg_date": "2024-07-25", "view_cnt": 87 },
    { "num": 6, "title": "게시물 제목 6", "writer": "강민정", "reg_date": "2024-07-24", "view_cnt": 92 },
    { "num": 7, "title": "게시물 제목 7", "writer": "윤지호", "reg_date": "2024-07-23", "view_cnt": 110 },
    { "num": 8, "title": "게시물 제목 8", "writer": "정희진", "reg_date": "2024-07-22", "view_cnt": 65 },
    { "num": 9, "title": "게시물 제목 9", "writer": "오준영", "reg_date": "2024-07-21", "view_cnt": 130 },
    { "num": 10, "title": "게시물 제목 10", "writer": "한예슬", "reg_date": "2024-07-20", "view_cnt": 75 },
    { "num": 11, "title": "게시물 제목 11", "writer": "한예슬", "reg_date": "2024-07-20", "view_cnt": 75 },
    { "num": 12, "title": "게시물 제목 12", "writer": "한예슬", "reg_date": "2024-07-20", "view_cnt": 75 },
    { "num": 13, "title": "게시물 제목 13", "writer": "한예슬", "reg_date": "2024-07-20", "view_cnt": 75 },
    { "num": 15, "title": "게시물 제목 15", "writer": "한예슬", "reg_date": "2024-07-20", "view_cnt": 75 }
];

export const List = (category) => {
    const navigate = useNavigate();
    const name = category.category.name;
    const code = category.category.code;

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest', 'viewCount'
    const itemsPerPage = 10;

    // Calculate the indices for the current page's items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Sorting the items based on the sortOrder
    const sortedData = () => {
        switch (sortOrder) {
            case 'viewCount':
                return [...dummy].sort((a, b) => b.view_cnt - a.view_cnt);
            case 'latest':
            default:
                return [...dummy].sort((a, b) => new Date(b.reg_date) - new Date(a.reg_date));
        }
    };

    const currentItems = sortedData().slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages
    const totalPages = Math.ceil(dummy.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle row click
    const handleRowClick = (id) => {
        navigate(`/Notice/Detail`);
    };

    // Toggle sort order
    const handleToggleSort = (order) => {
        setSortOrder(order);
        setCurrentPage(1); // Reset to first page
    };

    return (
        <div className={styles.container}>
            <div className={styles.category_header}>
                <div className={styles.headerLeft}>
                    <h2>{name}</h2>
                    <p>{code}</p>
                </div>
                <div className={styles.header_Right}>
                    <Link id={styles.write} to="Edit">등록하기</Link>
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
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>글쓴이</th>
                            <th>작성일자</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((v) => (
                            <tr key={v.num} onClick={() => handleRowClick(v.num)} className={styles.row}>
                                <td>{v.num}</td>
                                <td>{v.title}</td>
                                <td>{v.writer}</td>
                                <td>{v.reg_date}</td>
                                <td>{v.view_cnt}</td>
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
