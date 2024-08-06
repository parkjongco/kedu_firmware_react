import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Messenger.module.css';

axios.defaults.withCredentials = true;

const Messenger = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [client, setClient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // 사용자 정보 및 유저 목록 가져오기
  useEffect(() => {
    const loginID = sessionStorage.getItem('loginID');
    if (loginID) {
      axios.get('http://192.168.1.11/users/all')
        .then((response) => {
          const users = response.data;
          const currentUser = users.find(user => user.users_code === loginID);
          if (currentUser) {
            setUsername(currentUser.users_name);
            setUsers(users.filter(user => user.users_name !== currentUser.users_name)); // 본인 제외
          } else {
            console.error('로그인한 사용자 정보를 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        });
    }

    const socket = new SockJS('http://192.168.1.11/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/public', (message) => {
          showMessage(JSON.parse(message.body));
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket error: ', frame);
      }
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  // 채팅 상대 선택 시 메시지 불러오기
  const selectUser = async (user) => {
    setSelectedUser(user);
    try {
      const response = await axios.get(`http://192.168.1.11/messages/chat/${username}/${user.users_name}`);
      setMessages(response.data);
    } catch (error) {
      console.error('채팅 기록을 가져오는 중 오류 발생:', error);
    }
  };

  const showMessage = (message) => {
    if (
      (message.sender_username === username && message.receiver_username === selectedUser?.users_name) ||
      (message.sender_username === selectedUser?.users_name && message.receiver_username === username)
    ) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) {
      console.error('Cannot send empty message');
      return;
    }

    if (!username.trim() || !selectedUser) {
      console.error('Username or selected user is required');
      return;
    }

    if (client) {
      const message = {
        sender_username: username,
        receiver_username: selectedUser.users_name,
        content: inputMessage,
        send_date: new Date().toISOString()
      };

      try {
        await axios.post('http://192.168.1.11/messages/send', message, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Message sent successfully');
        setInputMessage('');
        showMessage(message);
      } catch (error) {
        console.error('Error sending message: ', error);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized: Please log in.');
        } else {
          console.error('Failed to send message:', error.message);
        }
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
            <div>유저 목록</div>
            <ul>
              {users.map(user => (
                <li key={user.users_code} onClick={() => selectUser(user)}>
                  {user.users_name}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.messengerMain}>
            <div>채팅방: {selectedUser ? selectedUser.users_name : "선택된 사용자가 없습니다"}</div>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>
                  {msg.sender_username}: {msg.content}
                </li>
              ))}
            </ul>
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
