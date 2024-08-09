import { create } from 'zustand';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const useAttendanceStore = create((set) => ({


    attendance: {
        checkIn: null, // 출근 시간 상태
        checkOut: null // 퇴근 시간 상태
    },

    setAttendance: (attendance) => set({ attendance }),

    hasCheckedIn: false, //출석이 눌려졌는지?


    // 이 시점에서 Attendance테이블의 check_in_time에 데이터 삽입
    handleCheckIn: () => {
        const now = new Date().toLocaleTimeString();
        set((state) => ({
            attendance: {
                ...state.attendance,
                checkIn: now,
            },
            hasCheckedIn: true, // 출석 체크 완료
        }));
        console.log("now");
        // axios.post(`${serverUrl}/api/attendance/checkin`, { time: now })
        //   .then(response => console.log('Check-in recorded:', response))
        //   .catch(error => console.error('Error recording check-in:', error));
    },

    // 이 시점에서 Attendance테이블의 check_out_time에 데이터 삽입
    handleCheckOut: () => {
        const now = new Date().toLocaleTimeString();
        set((state) => ({
            attendance: {
                ...state.attendance,
                checkOut: now,
            }
        }));
        console.log("now");
        // axios.post(`${serverUrl}/api/attendance/checkout`, { time: now })
        //   .then(response => console.log('Check-out recorded:', response))
        //   .catch(error => console.error('Error recording check-out:', error));
    }





    
    // const [attendance, setAttendance] = useState({
    //     checkIn: null, //출근 시간 상태
    //     checkOut: null //퇴근 시간 상태
    //   });
    
    
    //   // 이 시점에서 Attendance테이블의 check_in_time에 데이터 삽입
    //   const handleCheckIn = () => {
    //     const now = new Date().toLocaleTimeString();
    //     setAttendance((prev) => ({ ...prev, checkIn: now }));
    
    
    //     console.log("now");
    //     // axios.post('/api/attendance/checkin', { time: now })
    //     //   .then(response => console.log('Check-in recorded:', response))
    //     //   .catch(error => console.error('Error recording check-in:', error));
    //   };
    
    //   // 이 시점에서 Attendance테이블의 check_out_time에 데이터 삽입
    //   const handleCheckOut = () => {
    //     const now = new Date().toLocaleTimeString();
    //     setAttendance((prev) => ({ ...prev, checkOut: now }));
    
    //     console.log("now");
    //     // axios.post('/api/attendance/checkout', { time: now })
    //     //   .then(response => console.log('Check-out recorded:', response))
    //     //   .catch(error => console.error('Error recording check-out:', error));
    //   };

}));