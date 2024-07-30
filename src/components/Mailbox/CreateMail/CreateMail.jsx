import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreateMail.module.css';

const CreateMail = () => {
  const [to, setTo] = useState(''); // 받는사람
  const [subject, setSubject] = useState(''); // 제목
  const [message, setMessage] = useState(''); // 내용
  const [attachments, setAttachments] = useState([]); // 파일첨부

  const handleAddAttachment = () => {
    // '파일 첨부 버튼'을 클릭하면 첨부 리스트에 빈 항목을 추가한다.
    setAttachments([...attachments, '']);
  };

  const handleFileChange = (e, index) => {
    // 파일이 변경되면 해당 파일을 첨부 리스트의 특정 인덱스에 업데이트
    const files = [...attachments];
    files[index] = e.target.files[0];
    setAttachments(files);
  };

  const handleSubmit = async () => { 
    // async -> await 키워드를 사용하기위하여 필요
    // -> 에러 핸들링을 간단하게 하기위함

    console.log(to);
    console.log(subject);
    console.log(message);

    // FormData 객체에 폼데이터를 추가하고 서버로 전송
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('message', message);
    attachments.forEach((file) => {
      formData.append(`attachments`, file);
    });
    console.log("파일 처리 확인 중")
    try {
      //await : axios.post가 처리될때까지 기다린 후 response 변수에 할당(디버깅 목적)
      console.log("보냅니다!!");
      const response = await axios.post(`http://192.168.1.36/mail`, formData);        
      alert('메일이 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('메일 전송 오류:', error);
      alert('메일 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.composeContainer}>
      <h2>메일 쓰기</h2>
      <div className={styles.formGroup}>
        <label>받는사람</label>
        <input type="text" value={to} 
          onChange={(e) => setTo(e.target.value)} 
          required 
        />
      </div>
      <div className={styles.formGroup}>
        <label>제목</label>
        <input type="text" value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          required 
        />
      </div>
      <div className={styles.formGroup}>
        <label>파일첨부</label>
        {attachments.map((attachment, index) => (
          <input key={index} type="file" 
            onChange={(e) => handleFileChange(e, index)} 
          />
        ))}
        <button type="button" onClick={handleAddAttachment} className={styles.addButton}>+ 파일추가</button>
      </div>
      <div className={styles.formGroup}>
        <label>내용</label>
        <textarea value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
      </div>
      <button type="button" onClick={handleSubmit} className={styles.submitButton}>보내기</button>
    </div>
  );
};

export default CreateMail;
