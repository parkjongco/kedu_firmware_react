import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Detail.module.css';
import { useAuthStore } from '../../../store/store';

axios.defaults.withCredentials = true;

const Detail = () => {
    // 네비게이션과 현재 위치를 위한 hooks
    const navigate = useNavigate();
    const location = useLocation();
    
    // 사용자 이름을 얻기 위한 상태 관리
    const { usersName } = useAuthStore();

    // 상태 변수 선언
    const [board, setBoard] = useState(null); // 게시글 데이터
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
    const [updatedTitle, setUpdatedTitle] = useState(''); // 수정된 제목
    const [updatedContents, setUpdatedContents] = useState(''); // 수정된 내용
    const [comments, setComments] = useState([]); // 댓글 목록
    const [newComment, setNewComment] = useState(''); // 새 댓글 내용
    const [editingCommentId, setEditingCommentId] = useState(null); // 편집 중인 댓글 ID
    const [editedCommentText, setEditedCommentText] = useState(''); // 편집된 댓글 내용

    // URL에서 게시글 ID 추출
    const seq = location.pathname.split('/').pop();
    const serverUrl = process.env.REACT_APP_SERVER_URL; // 서버 URL
    const sessionUserName = sessionStorage.getItem("usersName") || "Unknown User"; // 세션에서 사용자 이름

    // 컴포넌트가 처음 렌더링될 때 게시글 및 댓글 데이터 로드
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

    }, [seq, serverUrl]);

    // 게시글 업데이트 처리
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

    // 게시글 삭제 처리
    const handleDeleteBoard = () => {
        axios.delete(`${serverUrl}/board/${seq}`)
            .then(() => {
                navigate("/Board"); // 삭제 후 게시판 목록으로 이동
            })
            .catch(error => {
                console.error('Error deleting board:', error);
            });
    };

    // 편집 모드 전환
    const toggleEditMode = () => {
        setIsEditing(prev => !prev);
    };

    // 새 댓글 제출 처리
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

    // 댓글 업데이트 처리
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

    // 댓글 삭제 처리
    const handleDeleteComment = (commentId) => {
        axios.delete(`${serverUrl}/board_reply/${seq}/${commentId}`)
            .then(() => {
                setComments(prevComments => prevComments.filter(comment => comment.reply_seq !== commentId));
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
            });
    };

    // 댓글 편집 모드 전환
    const handleCommentEdit = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setEditedCommentText(commentText);
    };

    // 게시글 데이터가 로드되지 않은 경우 로딩 메시지 표시
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
