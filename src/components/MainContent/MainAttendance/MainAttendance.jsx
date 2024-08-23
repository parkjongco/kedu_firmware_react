import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MainAttendance.module.css';
import { useAttendanceStore } from '../../../store/attendance_store';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const MainAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    fetchDepartmentMembers,
    departmentMembers,
    clearDepartmentMembers
  } = useAttendanceStore();

  // 부서원 정보를 먼저 로드한 후 출근 현황을 불러오는 함수
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      clearDepartmentMembers();  // 부서원 상태 초기화
      await fetchDepartmentMembers();  // 부서원 정보 불러오기
    } catch (error) {
      console.error('Error fetching department members:', error);
    } finally {
      setIsLoading(false);  // 로딩 상태 해제
    }
  };

  // 출근 현황 데이터를 로드하는 함수
  const loadAttendanceData = async () => {
    if (departmentMembers.length === 0) return;  // 부서원 정보가 없으면 실행하지 않음
    setIsLoading(true);
    try {
      const usersSeq = sessionStorage.getItem("usersSeq");
      if (usersSeq) {
        const formattedDate = currentDate.toLocaleDateString('en-CA');
        const response = await axios.get(`${serverUrl}/attendance/departmentEvents`, {
          params: { users_seq: usersSeq, date: formattedDate }
        });

        // console.log('Department events response:', response.data);

        // 부서원 정보와 출근 기록을 결합
        const updatedAttendanceData = departmentMembers.map((member) => {
          const attendanceRecord = response.data.find(event => event.users_seq === member.USERSSEQ);
          // console.log(`Attendance record for ${member.USERSNAME}:`, attendanceRecord);

          return attendanceRecord ? {
            ...member,
            ...attendanceRecord
          } : {
            ...member,
            status: '미출석',
            check_in_time: null,
            check_out_time: null
          };
        });

        // console.log('Updated attendance data:', updatedAttendanceData);
        setAttendanceData(updatedAttendanceData);
      }
    } catch (error) {
      console.error('Error fetching department events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 부서원 정보가 로드된 후 출근 현황 데이터를 불러옴
  useEffect(() => {
    loadInitialData();
  }, [currentDate]);

  // 부서원 정보가 성공적으로 로드된 후 출근 현황을 불러옴
  useEffect(() => {
    if (departmentMembers.length > 0) {
      loadAttendanceData();
    }
  }, [departmentMembers]);  // departmentMembers 상태가 변경될 때마다 실행

  const formatTime = (dateTime) => {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.attendanceContainer}>
        <h2>출근 현황</h2>
        {isLoading ? (
          <p>출근 기록을 불러오는 중입니다...</p>
        ) : attendanceData.length > 0 ? (
          attendanceData.map((employee, index) => (
            <div key={index} className={styles.attendance_item}>
              <div className={styles.attendance_label}>{employee.USERSNAME}</div>
              <div className={styles.attendance_status}>
                {employee.check_in_time ? '출근 완료' : '미출석'}
              </div>
              <div className={styles.attendance_time}>
                {employee.check_in_time ? formatTime(employee.check_in_time) : '-'}
              </div>
            </div>
          ))
        ) : (
          <p>같은 부서 인원 없음</p>
        )}
      </div>

      <div className={styles.profileContainer}>
        <h2>부서 프로필</h2>
        {departmentMembers.length > 0 ? (
          departmentMembers.map((member, index) => (
            <div key={index} className={styles.profile_item}>
              <div className={styles.profile_name}>{member.USERSNAME}</div>
              <div className={styles.profile_email}>{member.USERSEMAIL}</div>
              <div className={styles.profile_phone}>{member.PHONENUMBER}</div>
            </div>
          ))
        ) : (
          <p>부서원 정보가 없습니다</p>
        )}
      </div>
    </div>
  );
};

export default MainAttendance;
