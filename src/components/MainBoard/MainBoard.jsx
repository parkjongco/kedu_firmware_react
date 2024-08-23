import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MainBoard.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const MainBoard = ({ category }) => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        // Fetch posts for the specified category
        axios.get(`${serverUrl}:3000/board/${category.category_seq}`)
            .then(response => {
                setPosts(response.data);
                setCurrentPage(1); // Reset to first page on data fetch
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, [category]);

    // Pagination logic
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={styles.posts}>
            {currentPosts.length > 0 ? (
                currentPosts.map(post => (
                    <div key={post.board_seq} className={styles.post}>
                        <h3>{post.board_title}</h3>
                        <p>{post.board_content}</p>
                    </div>
                ))
            ) : (
                <p>게시물이 없습니다.</p>
            )}

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
    );
};

export default MainBoard;
