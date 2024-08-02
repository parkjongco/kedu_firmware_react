import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Detail.module.css';

const Detail = (host) => {
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedContents, setUpdatedContents] = useState('');
    const location = useLocation();

    const seq = location.pathname.split('/').pop();

    useEffect(() => {
        axios.get(`${host}/board/detail/${seq}`)
            .then(resp => {
                setBoard(resp.data);
                setUpdatedTitle(resp.data.board_title);
                setUpdatedContents(resp.data.board_contents);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [seq]);

    const handleUpdate = (e) => {
        const updatedData = {
            board_title: updatedTitle,
            board_contents: updatedContents,
        };

        axios.put(`${host}/board/${seq}`, updatedData)
            .then(resp => {
                setBoard(resp.data);
                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    };

    const toggleEditMode = () => {
        setIsEditing(prev => !prev);
    };

    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {isEditing ? (
                    <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        className={styles.titleInput}
                    />
                ) : (
                    <div className={styles.title}>{board.board_title}</div>
                )}
                <div>
                    {!isEditing ? (
                        <button onClick={toggleEditMode} className={styles.button}>수정하기</button>
                    ) : (
                        <div className={styles.button_container}>
                            <form onSubmit={handleUpdate} className={styles.editForm}>
                                <button type="submit" className={styles.button}>수정완료</button>
                                <button type="button" onClick={toggleEditMode} className={styles.button}>취소하기</button>
                            </form>
                        </div>
                    )}
                    <button onClick={() => navigate("/Board")} className={styles.button}>뒤로가기</button>
                </div>
            </div>
            <div className={styles.body}>
                <div><strong>글쓴이:</strong> {board.writer}</div>
                <div><strong>작성일자:</strong> {new Date(board.board_write_date).toLocaleString()}</div>
                <div><strong>조회수:</strong> {board.board_view_count}</div>
            </div>
            <div className={styles.content}>
                {isEditing ? (
                    <form onSubmit={handleUpdate} className={styles.editForm}>
                        <div>
                            <label>
                                내용:
                                <div
                                    contentEditable
                                    className={styles.contentEditable}
                                    onInput={(e) => setUpdatedContents(e.currentTarget.textContent)}
                                >
                                    {updatedContents}
                                </div>
                            </label>
                        </div>
                    </form>
                ) : (
                    <div
                        dangerouslySetInnerHTML={{ __html: board.board_contents }}
                    />
                )}
            </div>
        </div>
    );
};

export default Detail;
