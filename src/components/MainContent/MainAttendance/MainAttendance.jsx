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

  const usersSeq = sessionStorage.getItem("usersSeq");

  // 부서원 정보를 먼저 로드한 후 출근 현황을 불러오는 함수
  const loadAttendanceData = async () => {
    if (departmentMembers.length === 0) return; // 부서원 정보가 없으면 실행하지 않음
  
    try {
      if (usersSeq) {
        const formattedDate = currentDate.toLocaleDateString('en-CA');
        const response = await axios.get(`${serverUrl}/attendance/departmentEvents`, {
          params: { users_seq: usersSeq, date: formattedDate }
        });
  
        // 서버로부터 받은 데이터 확인
        console.log('Department events response:', response.data);
  
        // 응답 데이터가 배열인지 확인
        const attendanceEvents = Array.isArray(response.data) ? response.data : [];
  
        // 부서원 정보와 출근 기록을 결합
        const updatedAttendanceData = departmentMembers.map((member) => {
          // 부서원의 출근 기록을 전체 부서 출근 현황과 매칭
          const attendanceRecord = attendanceEvents.find(event => {
            return String(event.users_seq) === String(member.USERSSEQ);
          });
  
          // 출근 기록이 있는 경우 '출근 완료', 없으면 '미출석'으로 상태 설정
          return {
            ...member,
            status: attendanceRecord ? '출근 완료' : '미출석',
            check_in_time: attendanceRecord ? attendanceRecord.check_in_time : null,
            check_out_time: attendanceRecord ? attendanceRecord.check_out_time : null
          };
        });
  
        console.log('Updated attendance data:', updatedAttendanceData);
        setAttendanceData(updatedAttendanceData);
      }
    } catch (error) {
      console.error('Error fetching department events:', error);
    }
  };

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 또는 usersSeq가 변경될 때 상태를 초기화하고 데이터를 불러옴
    const initializeData = async () => {
      setIsLoading(true);
      try {
        clearDepartmentMembers(); // 부서원 상태 초기화
        await fetchDepartmentMembers(); // 부서원 정보 불러오기
        await loadAttendanceData(); // 출근 현황 데이터 불러오기
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    if (usersSeq) {
      initializeData(); // 초기 데이터 로드
    }
  }, [usersSeq]); // usersSeq가 변경될 때만 실행

  useEffect(() => {
    // departmentMembers 상태가 변경될 때마다 출근 현황 데이터를 불러옴
    if (departmentMembers.length > 0) {
      loadAttendanceData();
    }
  }, [departmentMembers]); // departmentMembers 상태가 변경될 때만 실행
  
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
                {employee.status} {/* 상태를 표시 */}
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
