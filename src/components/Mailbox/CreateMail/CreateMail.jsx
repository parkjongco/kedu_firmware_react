import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreateMail.module.css';

const CreateMail = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleAddAttachment = () => {
    setAttachments([...attachments, '']);
  };

  const handleFileChange = (e, index) => {
    const files = [...attachments];
    files[index] = e.target.files[0];
    setAttachments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('message', message);
    attachments.forEach((file, index) => {
      formData.append(`attachment${index}`, file);
    });

    try {
      const response = await axios.post('/api/sendMail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('메일이 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('메일 전송 오류:', error);
      alert('메일 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.composeContainer}>
      <h2>메일 쓰기</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>받는사람</label>
          <input 
            type="text" 
            value={to} 
            onChange={(e) => setTo(e.target.value)} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label>제목</label>
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label>파일첨부</label>
          {attachments.map((attachment, index) => (
            <input 
              key={index} 
              type="file" 
              onChange={(e) => handleFileChange(e, index)} 
            />
          ))}
          <button type="button" onClick={handleAddAttachment} className={styles.addButton}>+ 파일추가</button>
        </div>
        <div className={styles.formGroup}>
          <label>내용</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className={styles.submitButton}>보내기</button>
      </form>
    </div>
  );
};

export default CreateMail;
