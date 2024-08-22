import React, { useEffect } from 'react';
import { useCalendarStore, useAuthStore } from '../../../store/store';
import axios from 'axios';
import styles from './MainCalendar.module.css';

// 서버 URL을 환경 변수로 설정
const serverUrl = process.env.REACT_APP_SERVER_URL;

axios.defaults.withCredentials = true;

const MainCalendar = () => {
  const events = useCalendarStore((state) => state.events);
  const setEvents = useCalendarStore((state) => state.setEvents);
  const usersName = useAuthStore((state) => state.usersName); // 로그인한 사용자 이름 가져오기

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await axios.get(`${serverUrl}/events`);
        setEvents(response.data); // 응답 데이터를 상태에 저장
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();
  }, [setEvents]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h2>내 캘린더 일정</h2>
        <div className={styles.actions}>
          <span>오늘부터 7일간</span>
          <button className={styles.refreshButton}>⟳</button>
          <button className={styles.navButton}>◀</button>
          <button className={styles.navButton}>▶</button>
        </div>
      </div>
      {events.length === 0 ? (
        <p>일정이 없습니다.</p>
      ) : (
        events.map((event) => (
          <div key={event.eventsSeq} className={styles.calendar_item}>
            <div className={styles.date}>{formatDate(event.eventsStartDate)}</div>
            <div className={styles.event}>{event.eventsTitle}</div>
            <div className={styles.location}>{usersName}</div>
            <div className={styles.time}>
              {formatTime(event.eventsStartDate)} - {formatTime(event.eventsEndDate)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MainCalendar;
