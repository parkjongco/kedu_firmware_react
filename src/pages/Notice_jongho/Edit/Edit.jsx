import React, { useRef, useEffect, useState } from 'react';
import styles from './Edit.module.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/editor';

export default function Edit() {
    const editorRef = useRef(null);
    const [fileComment, setFileComment] = useState("여기를 눌러 추가하거나, 끌어서 추가하세요");
    const [editorInstance, setEditorInstance] = useState(null);

    useEffect(() => {
        if (editorRef.current && !editorInstance) {
            const instance = new Editor({
                el: editorRef.current,
                height: '500px',
                initialEditType: 'markdown',
                previewStyle: 'vertical',
            });

            // 초기 값을 빈 문자열로 설정
            instance.setMarkdown('');
            setEditorInstance(instance);
        }
    }, [editorRef, editorInstance]);

    return (
        <div className={styles.container}>
            <div className={styles.category_header}>
                <h2>글 작성하기</h2>
                <button>등록하기</button>
            </div>
            <div className={styles.title}>
                <input type="text" id={styles.title} placeholder="제목을 입력하세요" />
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

    function getFileName(e) {
        const files = e.target.files;
        if (files.length === 0) {
            setFileComment("여기를 눌러 추가하거나, 끌어서 추가하세요");
            return;
        }
        let filenames = Array.from(files).map(file => file.name).join("\n");
        setFileComment(filenames);
    }
};
