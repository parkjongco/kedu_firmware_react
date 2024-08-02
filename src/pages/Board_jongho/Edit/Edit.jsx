
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 리액트 라우터에서 useNavigate 훅을 가져옵니다.
import styles from './Edit.module.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/editor';
import axios from 'axios';

export default function Edit() {
    const editorRef = useRef(null);
    const [fileComment, setFileComment] = useState("여기를 눌러 추가하거나, 끌어서 추가하세요");
    const [editorInstance, setEditorInstance] = useState(null);
    const [boardTitle, setBoardTitle ] = useState("");
    const navigate = useNavigate(); 

    useEffect(() => {
        if (editorRef.current && !editorInstance) {
            const instance = new Editor({
                el: editorRef.current,
                height: '400px',
                initialEditType: 'markdown',
                previewStyle: 'vertical',
            });

            instance.setMarkdown('');
            setEditorInstance(instance);
        }
    }, [editorRef, editorInstance]);

    return (
        <div className={styles.container}>
            <div className={styles.category_header}>
                <h2>글 작성하기</h2>
                <div className={styles.button_container}>
                    <button className={styles.action_button} onClick={submit}>등록하기</button>
                    <button className={styles.action_button} onClick={() => navigate("/Board")}>뒤로가기</button>
                </div>
            </div>
            <div className={styles.title}>
                <input type="text" id={styles.title} onChange={(e) => setBoardTitle(e.target.value)} placeholder="제목을 입력하세요" />
            </div>
            <div className={styles.content}>
                <div ref={editorRef}></div>
            </div>
            <div className={styles.file_container}>
                <input type="file" id="file" onChange={e => getFileName(e)} multiple hidden />
                <label htmlFor="file" className={styles.file}>
                    {fileComment}
                </label>
            </div>

        </div>
    );

    function submit() {
        const content = editorInstance.getHTML().toString();

        // 제목이나 내용이 비어있는지 확인
        if (!boardTitle.trim() || !content.trim()) {
            alert("값을 입력하여 주세요");
            return;
        }

        axios.post(
            "http://localhost:80/board", 
            {
                board_title: boardTitle,
                board_contents: content
            }
        ).then(function (response) {
            if(response.status == 200) {
                alert("등록 성공");
                navigate("/Board");
            }
            else {
                alert("등록 실패 : " + response.status)
            }
        }).catch(function (error) {
            console.log("err", error);
        })
    }

    function getFileName(e) {
        const files = e.target.files;
        if (files.length === 0) {
            setFileComment("여기를 눌러 파일을 추가하거나, 끌어서 추가하세요");
            return;
        }
        let filenames = Array.from(files).map(file => file.name).join("\n");
        setFileComment(filenames);
    }
};