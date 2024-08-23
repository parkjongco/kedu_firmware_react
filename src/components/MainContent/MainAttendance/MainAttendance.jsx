import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MainAttendance.module.css';
import { useAttendanceStore } from '../../../store/attendance_store';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const MainAttendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchDepartmentMembers, departmentMembers} = useAttendanceStore();

  useEffect(() => {

    fetchDepartmentMembers();  // 부서원 정보 조회

    const usersSeq = sessionStorage.getItem("usersSeq"); // usersSeq를 세션에서 가져옴
    if (usersSeq) {
        // 선택한 날짜를 로컬 시간 기준으로 `YYYY-MM-DD` 형식으로 포맷팅
        const formattedDate = currentDate.toLocaleDateString('en-CA');
        // console.log(formattedDate) 
        fetchDepartmentEvents(usersSeq, formattedDate);  // 이벤트 조회
    }
}, [currentDate]);


// 부서 일정 가져오기 - usersSeq와 날짜를 기반으로
const fetchDepartmentEvents = async (usersSeq, date) => {
  try {
    const response = await axios.get(`${serverUrl}/attendance/departmentEvents`, {
      params: { users_seq: usersSeq, date: date }
    });
    console.log('Department events response:', response.data);  // 응답 데이터 구조 확인

    // 부서원 정보와 출근 기록을 결합
    const updatedAttendanceData = departmentMembers.map((member) => {
      const attendanceRecord = response.data.find(event => event.users_seq === member.USERSEQ);

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

    setAttendanceData(updatedAttendanceData);
    setIsLoading(false);  // 데이터 로딩 후 로딩 상태 해제

  } catch (error) {
    console.error('Error fetching department events:', error);
    setIsLoading(false);  // 에러 발생 시에도 로딩 상태 해제
  }
}

  return (
    <div className={styles.attendanceContainer}>
      <h2>출근 현황</h2>
      {isLoading ? (
        <p>출근 기록을 불러오는 중입니다...</p>
      ) : attendanceData.length > 0 ? (
        attendanceData.map((employee) => (
          <div key={employee.attendance_id} className={styles.attendance_item}>
            <div className={styles.attendance_label}>{employee.USERSNAME}</div>
            <div className={styles.attendance_status}>
              {employee.check_in_time ? '출근 완료' : '미출석'}
            </div>
            <div className={styles.attendance_time}>
              {employee.check_in_time ? employee.check_in_time : '-'}
            </div>
          </div>
        ))
      ) : (
        <p>같은 부서 인원 없음</p>
      )}
    </div>
  );
};

export default MainAttendance;
