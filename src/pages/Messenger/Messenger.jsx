import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Messenger.module.css';

const Messenger = () => {
  const [messages, setMessages] = useState([]); // 수신된 메시지를 저장하는 상태
  const [inputMessage, setInputMessage] = useState(''); // 입력된 메시지를 저장하는 상태
  const [username, setUsername] = useState(''); // 사용자 이름을 저장하는 상태
  const [client, setClient] = useState(null); // STOMP 클라이언트를 저장하는 상태

  // WebSocket 연결 설정
  useEffect(() => {
    // SockJS를 통해 WebSocket 연결을 생성
    const socket = new SockJS('http://192.168.1.11/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        // '/topic/public' 경로를 구독하여 메시지 수신
        stompClient.subscribe('/topic/public', (message) => {
          showMessage(JSON.parse(message.body));
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket error: ', frame);
      }
    });

    stompClient.activate(); // STOMP 클라이언트 활성화
    setClient(stompClient); // 클라이언트를 상태로 저장

    return () => {
      if (stompClient) {
        stompClient.deactivate(); // 컴포넌트가 언마운트될 때 클라이언트 비활성화
      }
    };
  }, []);

  // 새로운 메시지를 메시지 리스트에 추가
  const showMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputMessage.trim()) {
      console.error('Cannot send empty message');
      return;
    }

    if (!username.trim()) {
      console.error('Username is required');
      return;
    }

    if (client) {
      const message = {
        sender_username: username, // 필드 이름을 서버의 DTO에 맞게 변경
        receiver_username: 'Receiver', // 수신자 설정
        content: inputMessage, // 메시지 내용
        send_date: new Date().toISOString() // ISO 형식의 전송 날짜
      };

      try {
        const response = await fetch('http://192.168.1.11/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message) // JSON 형식으로 메시지 변환
        });

        if (!response.ok) {
          // HTTP 오류가 발생한 경우
          const errorText = await response.text(); // 서버에서 반환한 오류 메시지
          throw new Error(`Failed to send message: ${errorText}`);
        }

        console.log('Message sent successfully');
        setInputMessage(''); // 성공적으로 전송한 경우 입력 필드 초기화
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    } else {
      console.error('Client is not connected');
    }
  };

  return (
    <div className={styles.messengerContainer}>
      <Header />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.messengerBody}>
          <div className={styles.messengerSidebar}>
            <div>유저 목록 출력</div>
            <ul>
      
            </ul>
          </div>
          <div className={styles.messengerMain}>
            <div>채팅방 목록</div>
            <ul>
       
            </ul>
          </div>
          <div className={styles.messengerChat}>
            <div>채팅방</div>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>
                  {msg.sender_username}: {msg.content}
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="메세지를 보내주세요"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button onClick={sendMessage}>전송</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
