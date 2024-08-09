import React, { useState, useEffect } from 'react';
import styles from './AttendanceManagement.module.css';
import { useAttendanceStore } from '../../../store/attendance_store';

const AttendanceManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dates, setDates] = useState([]);
  const { fetchEvents, events, fetchAttendanceStatus } = useAttendanceStore(); // 스토어에서 직접 events 사용

  useEffect(() => {
    updateDates(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (dates.length > 0) {
      const usersSeq = sessionStorage.getItem("usersSeq");
      if (usersSeq) {
        fetchEvents(usersSeq, dates[0], dates[dates.length - 1]);
      }
    }
  }, [dates]);

  // 출석 확인 여부 체크 - 수정된 부분
  useEffect(() => {
    const usersSeq = sessionStorage.getItem("usersSeq");
    if (usersSeq) {
      fetchAttendanceStatus(usersSeq).then((result) => {
        console.log("Check-In Time:", result.checkIn);
        console.log("Check-Out Time:", result.checkOut);
      });
    }
  }, []);

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
              const event = events.find(event => event.attendance_date === date && isEventInTimeRange(event, time));
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
