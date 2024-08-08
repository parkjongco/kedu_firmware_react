import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Detail.module.css';
import { useAuthStore } from '../../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

axios.defaults.withCredentials = true;

const Detail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usersName } = useAuthStore();

    const [board, setBoard] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedContents, setUpdatedContents] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);  // 북마크 상태를 관리하는 상태

    const seq = location.pathname.split('/').pop();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const sessionUserName = sessionStorage.getItem("usersName") || "Unknown User";

    useEffect(() => {
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

        // 페이지 로드 시 북마크 상태 확인
        axios.get(`${serverUrl}/bookmark/${seq}`)
            .then(resp => {
                setIsBookmarked(resp.data.isBookmarked);
            })
            .catch(error => {
                console.error('Error checking bookmark status:', error);
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

    const handleDeleteBoard = () => {
        axios.delete(`${serverUrl}/board/${seq}`)
            .then(() => {
                navigate("/Board");
            })
            .catch(error => {
                console.error('Error deleting board:', error);
            });
    };

    const toggleEditMode = () => {
        setIsEditing(prev => !prev);
    };

    const handleCommentSubmit = (e) => {

        const commentData = {
            reply_userName: usersName || sessionUserName,
            reply_contents: newComment,
            board_seq: seq,
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
            reply_reg_date: new Date().toISOString(),
        };

        axios.put(`${serverUrl}/board_reply/${seq}/${commentId}`, updatedCommentData)
            .then(() => {
                setComments(prevComments => prevComments.map(comment =>
                    comment.reply_seq === commentId ? { ...comment, ...updatedCommentData } : comment
                ));
                setEditingCommentId(null);
                setEditedCommentText('');
            })
            .catch(error => {
                console.error('Error updating comment:', error);
            });
    };

    const handleDeleteComment = (commentId) => {
        axios.delete(`${serverUrl}/board_reply/${seq}/${commentId}`)
            .then(() => {
                setComments(prevComments => prevComments.filter(comment => comment.reply_seq !== commentId));
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
            });
    };

    const handleCommentEdit = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setEditedCommentText(commentText);
    };


    const handleBookmarkClick = () => {
        if (isBookmarked) {
            axios.delete(`${serverUrl}/bookmark`, { data: { board_seq: seq } })
                .then(() => {
                    setIsBookmarked(false);
                })
                .catch(error => {
                    console.error('Error removing bookmark:', error);
                });
        } else {
            axios.post(`${serverUrl}/bookmark`, { board_seq: seq, user_seq: sessionUserName })
                .then(() => {
                    setIsBookmarked(true);
                })
                .catch(error => {
                    console.error('Error adding bookmark:', error);
                });
        }
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
                    <div className={styles.title}>
                        {board.board_title}
                        <FontAwesomeIcon
                            icon={faBookmark}
                            className={styles.bookmarkIcon}
                            style={{ color: isBookmarked ? 'blue' : '#f0a500' }}
                            onClick={handleBookmarkClick} // 북마크 클릭 핸들러 연결
                        />
                    </div>
                )}
                <div>
                    {!isEditing ? (
                        <>
                            <button onClick={toggleEditMode} className={styles.button}>수정하기</button>
                            <button onClick={handleDeleteBoard} className={styles.button}>삭제하기</button>
                        </>
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
                                        className={styles.textarea}
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
                                                className={styles.textarea}
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
                                    <>
                                        <button onClick={() => handleCommentEdit(comment.reply_seq, comment.reply_contents)} className={styles.button}>수정</button>
                                        <button onClick={() => handleDeleteComment(comment.reply_seq)} className={styles.button}>삭제</button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>댓글이 없습니다.</div>
                    )}
                                        <form onSubmit={handleCommentSubmit} className={styles.comment_Form}>
                        <textarea
                            className={styles.textarea}
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

