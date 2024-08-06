import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const subscriptionRef = useRef(null);
  const isSendingMessage = useRef(false);

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  // 메시지 목록을 감싸는 div에 대한 ref
  const messagesEndRef = useRef(null);

  // 메시지를 표시하는 함수
  const showMessage = useCallback(
    (message) => {
      setMessages((prevMessages) => {
        // 이미 존재하는 메시지인지 확인
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg.send_date === message.send_date &&
            msg.content === message.content &&
            msg.sender_username === message.sender_username
        );

        // 중복 메시지가 아니면 추가
        if (!isDuplicate) {
          return [...prevMessages, message];
        }

        return prevMessages; // 중복 메시지는 추가하지 않음
      });
    },
    []
  );

  // 글로벌 메시지를 구독하는 함수
  const subscribeToGlobalMessages = useCallback(
    (client) => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe(); // 기존 구독 해제
      }

      const globalTopic = '/topic/messages';
      console.log('Subscribing to global topic:', globalTopic);

      // 메시지를 한 번만 구독하도록 설정
      subscriptionRef.current = client.subscribe(globalTopic, (message) => {
        console.log('Received global message:', message.body);
        showMessage(JSON.parse(message.body));
      });
    },
    [showMessage]
  );

  // 컴포넌트가 마운트될 때 한 번 실행되는 코드
  useEffect(() => {
    const loginID = sessionStorage.getItem('loginID');
    if (loginID) {
      axios
        .get(`${serverUrl}/users/all`)
        .then((response) => {
          const users = response.data;
          const currentUser = users.find((user) => user.users_code === loginID);
          if (currentUser) {
            setUsername(currentUser.users_name);
            setUsers(users.filter((user) => user.users_name !== currentUser.users_name));
          } else {
            console.error('로그인한 사용자 정보를 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        });
    }

    const socket = new SockJS(`${serverUrl}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('Connected to WebSocket');
        setClient(stompClient);
        subscribeToGlobalMessages(stompClient); // 구독 설정
      },
      onStompError: (frame) => {
        console.error('WebSocket error: ', frame);
      },
      reconnectDelay: 5000,
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe(); // 구독 해제
        }
        stompClient.deactivate();
      }
    };
  }, [serverUrl, subscribeToGlobalMessages]);

  // 사용자 선택 시 채팅 기록 로드
  const selectUser = async (user) => {
    setSelectedUser(user);

    try {
      const response = await axios.get(
        `${serverUrl}/messages/chat/${username}/${user.users_name}`
      );
      setMessages(response.data);
      console.log('Chat history loaded:', response.data);
    } catch (error) {
      console.error('채팅 기록을 가져오는 중 오류 발생:', error);
    }
  };

  // 메시지를 전송하는 함수
  const sendMessage = useCallback(() => {
    if (isSendingMessage.current) {
      return; // 이미 메시지를 보내고 있는 경우 종료
    }

    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) {
      console.error('빈 메시지를 보낼 수 없습니다');
      return;
    }

    if (!username.trim() || !selectedUser) {
      console.error('사용자 이름 또는 선택된 사용자가 필요합니다');
      return;
    }

    if (client) {
      isSendingMessage.current = true; // 플래그 설정

      const message = {
        sender_username: username,
        receiver_username: selectedUser.users_name,
        content: trimmedMessage,
        send_date: new Date().toISOString(),
      };

      client.publish({
        destination: `/app/chat`,
        body: JSON.stringify(message),
      });

      showMessage(message); // Send and immediately show message
      setInputMessage('');

      isSendingMessage.current = false; // 메시지 전송 후 플래그 해제
    } else {
      console.error('클라이언트가 연결되어 있지 않습니다');
    }
  }, [inputMessage, username, selectedUser, client, showMessage]);

  // Enter 키를 누르면 메시지 전송
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !isSendingMessage.current && inputMessage.trim()) {
        e.preventDefault(); // 기본 동작 방지
        sendMessage();
      }
    },
    [sendMessage, inputMessage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 메시지 목록의 끝으로 스크롤하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지가 변경될 때마다 자동으로 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 시간 형식을 지정하는 함수
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.messengerContainer}>
      <Header />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.messengerBody}>
          <div className={styles.messengerSidebar}>
            <div className={styles.sidebarHeader}>유저 목록</div>
            <ul>
              {users.map((user) => (
                <li key={user.users_code} onClick={() => selectUser(user)}>
                  {user.users_name}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.messengerMain}>
            <div className={styles.chatHeader}>
              채팅방: {selectedUser ? selectedUser.users_name : '선택된 사용자가 없습니다'}
            </div>
            <div className={styles.messengerChat}>
              <ul>
                {messages
                  .filter(
                    (msg) =>
                      (msg.sender_username === username &&
                        msg.receiver_username === selectedUser?.users_name) ||
                      (msg.receiver_username === username &&
                        msg.sender_username === selectedUser?.users_name)
                  )
                  .map((msg, index) => (
                    <li
                      key={index}
                      className={`${styles.messageContainer} ${
                        msg.sender_username === username
                          ? styles.messageSent
                          : msg.type === 'STATUS'
                          ? styles.messageStatus
                          : styles.messageReceived
                      }`}
                    >
                      <span>
                        {msg.type !== 'STATUS'
                          ? `${msg.sender_username}: ${msg.content}`
                          : msg.content}
                        <br />
                        <small>{formatTime(msg.send_date)}</small>
                      </span>
                    </li>
                  ))}
                {/* 마지막 메시지 요소를 위한 ref */}
                <div ref={messagesEndRef} />
              </ul>
            </div>
            <div className={styles.messageBox}>
              <input
                type="text"
                placeholder="메세지를 보내주세요"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;

