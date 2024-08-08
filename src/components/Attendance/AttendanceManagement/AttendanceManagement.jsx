import React, { useState, useEffect } from 'react';
import styles from './AttendanceManagement.module.css';
import axios from 'axios';

const AttendanceManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2024-08-07'));
  const [selectedDate, setSelectedDate] = useState('2024-08-07');
  const [dates, setDates] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    updateDates(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (dates.length > 0) {
      fetchEvents();
    }
  }, [dates]);

  const updateDates = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const datesArray = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      datesArray.push(newDate.toISOString().split('T')[0]);
    }

    setDates(datesArray);
  };

  const fetchEvents = async () => {
    // 실제 API 엔드포인트로 변경 필요
    // const response = await axios.get('/api/events', {
    //   params: {
    //     start: dates[0],
    //     end: dates[dates.length - 1],
    //   },
    // });
    // setEvents(response.data);

    // 임의의 이벤트 추가
    const mockEvents = [
      { date: '2024-08-06', title: '근무', startTime: 9, endTime: 18 },
      { date: '2024-08-07', title: '회의', startTime: 9, endTime: 11 }
    ];
    setEvents(mockEvents);
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const formatDayAndDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const dayNum = date.getDate();
    return `${day} ${dayNum}`;
  };

  const getFormattedDateRange = () => {
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    return `${start.getFullYear()}.${start.getMonth() + 1}.${start.getDate()} - ${end.getFullYear()}.${end.getMonth() + 1}.${end.getDate()}`;
  };

  const workHours = Array.from({ length: 24 }, (_, i) => i); // 0부터 23까지의 시간 배열

  const isEventInTimeRange = (event, time) => {
    return event.startTime <= time && event.endTime > time;
  };

  const getColSpan = (event) => {
    return event.endTime - event.startTime; // 종료 시간을 포함하지 않도록
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <button onClick={handlePrevWeek}>{"<"}</button>
        <span>{getFormattedDateRange()}</span>
        <button onClick={handleNextWeek}>{">"}</button>
        <button onClick={handleToday}>오늘</button>
      </div>
      <div className={styles.calendar}>
        <div className={styles.timeRow}>
          <div className={styles.dayCell}></div>
          {workHours.map(time => (
            <div key={time} className={`${styles.timeCell} ${time >= 9 && time <= 18 ? styles.workHour : ''}`}>
              {time}
            </div>
          ))}
        </div>
        {dates.map(date => (
          <div className={styles.dateRow} key={date}>
            <div className={styles.dayCell}>{formatDayAndDate(date)}</div>
            {workHours.map(time => {
              const event = events.find(event => event.date === date && isEventInTimeRange(event, time));
              if (event && event.startTime === time) {
                return (
                  <div key={time} className={styles.selected} style={{ gridColumnEnd: `span ${getColSpan(event)}` }}>
                    <div className={styles.event}>
                      {event.title} <br />
                      {event.startTime}:00 - {event.endTime}:00
                    </div>
                  </div>
                );
              }
              if (event && event.startTime < time && event.endTime > time) {
                return null;
              }
              return <div key={time} className={styles.cell}></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceManagement;