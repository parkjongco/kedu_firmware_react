import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Detail.module.css';
import { useAuthStore } from '../../../store/store';

axios.defaults.withCredentials = true;

const Detail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usersName } = useAuthStore(); // Zustand 스토어에서 사용자 이름 가져오기

    const [board, setBoard] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedContents, setUpdatedContents] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');

    const seq = location.pathname.split('/').pop();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const sessionUserName = sessionStorage.getItem("usersName") || "Unknown User";

    useEffect(() => {
        // 게시물과 댓글 데이터 요청
        axios.get(`${serverUrl}/board/detail/${seq}`)
            .then(resp => {
                setBoard(resp.data);
                setUpdatedTitle(resp.data.board_title);
                setUpdatedContents(resp.data.board_contents);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        axios.get(`${serverUrl}/board_reply/${seq}`)
            .then(resp => {
                setComments(resp.data || []);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }, [seq, serverUrl]);

    const handleUpdate = (e) => {
        const updatedData = {
            board_title: updatedTitle,
            board_contents: updatedContents,
        };

        axios.put(`${serverUrl}/board/${seq}`, updatedData)
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

    const handleCommentSubmit = (e) => {
        const commentData = {
            reply_userName: usersName || sessionUserName, // 사용자 이름
            reply_contents: newComment, // 댓글 내용
            board_seq: seq, // 부모 게시물의 seq
        };

        axios.post(`${serverUrl}/board_reply`, commentData)
            .then(resp => {
                setComments(prevComments => [...prevComments, resp.data]);
                setNewComment('');
            })
            .catch(error => {
                console.error('Error submitting comment:', error);
            });
    };

    const handleUpdateReply = (commentId) => {
        const updatedCommentData = {
            reply_contents: editedCommentText,
            reply_reg_date: new Date().toISOString(), // 현재 날짜와 시간
        };

        axios.put(`${serverUrl}/board_reply/${commentId}`, updatedCommentData)
            .then(resp => {
                setComments(prevComments => prevComments.map(comment =>
                    comment.reply_seq === commentId ? resp.data : comment
                ));
                setEditingCommentId(null);
                setEditedCommentText('');
            })
            .catch(error => {
                console.error('Error updating comment:', error);
            });
    };

    const handleCommentEdit = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setEditedCommentText(commentText);
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
                <div><strong>글쓴이:</strong> {board.board_userName || sessionUserName}</div>
                <div><strong>작성일자:</strong> {new Date(board.board_write_date).toLocaleString()}</div>
                <div><strong>조회수:</strong> {board.board_view_count}</div>
                <div className={styles.content}>
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className={styles.editForm}>
                            <div>
                                <label>
                                    내용:
                                    <textarea
                                        value={updatedContents}
                                        onChange={(e) => setUpdatedContents(e.target.value)}
                                        className={styles.contentEditable}
                                    />
                                </label>
                            </div>
                        </form>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{ __html: board.board_contents }}
                        />
                    )}
                </div>

                <div className={styles.comments_Section}>
                    <h3>댓글</h3>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.reply_seq} className={styles.comment}>
                                <div><strong>{comment.reply_userName || sessionUserName}</strong></div>
                                <div>
                                    {editingCommentId === comment.reply_seq ? (
                                        <div>
                                            <textarea
                                                value={editedCommentText}
                                                onChange={(e) => setEditedCommentText(e.target.value)}
                                                className={styles.comment_Input}
                                            />
                                            <button onClick={() => handleUpdateReply(comment.reply_seq)} className={styles.button}>수정 완료</button>
                                            <button onClick={() => setEditingCommentId(null)} className={styles.button}>취소</button>
                                        </div>
                                    ) : (
                                        <div>{comment.reply_contents}</div>
                                    )}
                                </div>
                                <div>{new Date(comment.reply_reg_date).toLocaleString()}</div>
                                {comment.reply_userName === (usersName || sessionUserName) && (
                                    <button onClick={() => handleCommentEdit(comment.reply_seq, comment.reply_contents)} className={styles.button}>수정</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>댓글이 없습니다.</div>
                    )}
                    <form onSubmit={handleCommentSubmit} className={styles.comment_Form}>
                        <textarea
                            className={styles.comment_Input}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 작성하세요"
                        />
                        <button type="submit" className={styles.button}>댓글 작성</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Detail;
