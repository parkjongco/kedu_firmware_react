import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';

axios.defaults.withCredentials = true; // 세션 쿠키 포함

const Admin = () => {
  const [form, setForm] = useState({
    department: '',
    unitCode: '',
    employeeCode: '',
    tempPassword: '',
    users_name: '',
    users_email: '',
    users_full_name: '',
    rank_seq: '',
    rank_title: ''
  });

  const [departments, setDepartments] = useState([]);
  const [unit, setUnit] = useState(''); // 선택된 유닛 부서 저장
  const [unitSeq, setUnitSeq] = useState(null); // unit_seq 저장
  const [ranks, setRanks] = useState([]); // 모든 직급 목록을 저장
  const [step, setStep] = useState(1); // 현재 단계 (1: 유저 등록, 2: 사원 등록)
  const [userSeq, setUserSeq] = useState(null); // 등록된 유저의 user_seq
  const [isLoading, setIsLoading] = useState(true); // 데이터 로드 상태 관리
  const navi = useNavigate();

  // 부서 목록을 가져오는 useEffect
  useEffect(() => {
    axios.get('http://192.168.1.36/admin/departments', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      setDepartments(response.data);
    })
    .catch(error => {
      console.error('Error fetching departments:', error);
      if (error.response && error.response.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해 주세요.');
        window.location.href = '/login';
      } else {
        alert('부서 정보를 가져오는 중 오류가 발생했습니다. 관리자에게 문의하세요.');
      }
    });
  }, []);

  // 부서 선택 시 유닛 코드를 가져와 input 필드에 표시하고 unit_seq도 가져오기
  useEffect(() => {
    if (form.department) {
      axios.get(`http://192.168.1.36/admin/departments/${form.department}/units`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        if (response.data.length > 0) {
          setUnit(response.data[0].unit_title); // 첫 번째 유닛 부서를 선택
          setForm(prev => ({ ...prev, unitCode: response.data[0].unit_code }));
          setUnitSeq(response.data[0].unit_seq); // unit_seq도 저장
        } else {
          setUnit('');
          setForm(prev => ({ ...prev, unitCode: '' }));
          setUnitSeq(null); // unit_seq도 초기화
        }
      })
      .catch(error => {
        console.error('Error fetching units:', error);
        alert('유닛 정보를 가져오는 중 오류가 발생했습니다.');
      });
    }
  }, [form.department]);

  // 직급 목록을 가져오는 useEffect
  useEffect(() => {
    axios.get('http://192.168.1.36/ranks', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log('Ranks loaded:', response.data); // 데이터 로드 후 상태 확인
      setRanks(response.data);
      setIsLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
    })
    .catch(error => {
      console.error('Error fetching ranks:', error);
      alert('직급 정보를 가져오는 중 오류가 발생했습니다.');
    });
  }, []);

  // 유닛 코드 선택 시 유저 코드와 패스워드를 생성
  useEffect(() => {
    if (form.unitCode && form.department) {
      generateRandomCredentials();
    }
  }, [form.unitCode, form.department]);

  // Input 태그의 변경을 처리하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 랜덤 ID 및 비밀번호 생성
  const generateRandomCredentials = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString(); // 4자리 랜덤 숫자
    setForm((prev) => ({
      ...prev,
      employeeCode: `${prev.unitCode}-${prev.department}-${randomId}`, // 예: U1-D1-1234
      tempPassword: randomId
    }));
  };

  // 첫 번째 단계: 유저 등록
  const handleUserSubmit = (e) => {
    e.preventDefault();

    if (!form.users_name || !form.users_email || !form.users_full_name) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    axios.post('http://192.168.1.36/users', {
      users_code: form.employeeCode,
      users_name: form.users_name,
      users_password: form.tempPassword,
      users_email: form.users_email,
      users_full_name: form.users_full_name,
      department_code: form.department,
      unit_code: form.unitCode,
      users_is_admin: 0 // 기본적으로 일반 유저로 등록
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(userResp => {
      const userSeq = userResp.data.users_seq; // 서버에서 반환된 user_seq를 가져옴
      if (userSeq) {
        setUserSeq(userSeq);
        setStep(2); // 다음 단계로 이동
      } else {
        throw new Error('유저 시퀀스를 받을 수 없습니다.');
      }
    })
    .catch(err => {
      console.log(err);
      alert('유저 등록 실패');
    });
  };

  // 두 번째 단계: 사원 등록
  const handleEmployeeSubmit = (e) => {
    e.preventDefault();

    // 부서, 유닛, 직급 선택 확인
    if (!form.department || !unitSeq || !form.rank_seq) { // unitSeq 및 rank_seq 사용
      alert('부서, 유닛 및 직급을 선택하세요.');
      return;
    }

    // department_title, unit_title, rank_title을 가져오기 위해 추가 요청
    axios.all([
      axios.get(`http://192.168.1.36/admin/departments/${form.department}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      axios.get(`http://192.168.1.36/admin/units/${unitSeq}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      axios.get(`http://192.168.1.36/ranks/${form.rank_seq}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    ])
    .then(axios.spread((departmentResponse, unitResponse, rankResponse) => {
      return axios.post('http://192.168.1.36/employees/register', {
        user_seq: userSeq,
        users_name: form.users_name,
        department_seq: parseInt(form.department),
        department_title: departmentResponse.data.department_title, // DB에서 가져온 값을 사용
        unit_seq: unitSeq,
        unit_title: unitResponse.data.unit_title, // DB에서 가져온 값을 사용
        rank_seq: parseInt(form.rank_seq),
        rank_title: rankResponse.data.rank_title, // DB에서 가져온 값을 사용
        employee_code: form.employeeCode,
        employee_hire_date: new Date().toISOString(),
        employee_leave_date: null,
        is_employee_validate: 'Y'
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }))
    .then(response => {
      console.log('Employee Registration Response:', response.data);
      alert('사원 등록 성공');
      resetForm();
      navi('/users/login');
    })
    .catch(err => {
      console.log(err);
      alert('사원 등록 실패');
    });
  };

  // 폼과 상태 초기화
  const resetForm = () => {
    setForm({
      department: '',
      unitCode: '',
      employeeCode: '',
      tempPassword: '',
      users_name: '',
      users_email: '',
      users_full_name: '',
      rank_seq: '',
      rank_title: ''
    });
    setUnit(''); // 유닛 필드도 초기화
    setUnitSeq(null); // unit_seq도 초기화
    setStep(1); // 첫 단계로 리셋
  };

  // 데이터 로드 중일 때 로딩 메시지 또는 스피너 표시
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.title}>Firmware</div>
      {step === 1 && (
        <form className={styles.loginForm} onSubmit={handleUserSubmit}>
          <div className={styles.inputContainer}>
            <select name="department" value={form.department} onChange={handleChange}>
              <option value="">부서 선택</option>
              {departments.map(dept => (
                <option key={dept.department_code} value={dept.department_code}>
                  {dept.department_title}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputContainer}>
            <input type="text" name="unitCode" placeholder="유닛 부서" value={unit} readOnly />
          </div>
          <div className={styles.inputContainer}>
            <select name="rank_seq" value={form.rank_seq} onChange={(e) => {
              const selectedRank = ranks.find(rank => rank.rank_seq === parseInt(e.target.value));
              
              if (selectedRank) { // 선택된 값이 undefined가 아닌 경우에만 설정
                setForm(prev => ({...prev, rank_seq: selectedRank.rank_seq, rank_title: selectedRank.rank_title}));
              } else {
                console.error('Rank not found for selected value');
              }
            }}>
              <option value="">직급 선택</option>
              {ranks.map(rank => (
                <option key={rank.rank_seq} value={rank.rank_seq}>
                  {rank.rank_title}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputContainer}>
            <input type="text" name="users_name" placeholder="사용자 이름" value={form.users_name} onChange={handleChange} required />
          </div>
          <div className={styles.inputContainer}>
            <input type="email" name="users_email" placeholder="이메일" value={form.users_email} onChange={handleChange} required />
          </div>
          <div className={styles.inputContainer}>
            <input type="text" name="users_full_name" placeholder="전체 이름" value={form.users_full_name} onChange={handleChange} required />
          </div>
          <div className={styles.inputContainer}>
            <input type="text" name="employeeCode" placeholder="사원 ID" value={form.employeeCode} readOnly />
          </div>
          <div className={styles.inputContainer}>
            <input type="text" name="tempPassword" placeholder="임시 비밀번호" value={form.tempPassword} readOnly />
          </div>
          <button type="submit" className={styles.loginButton}>유저 등록</button>
        </form>
      )}
      {step === 2 && (
        <form className={styles.loginForm} onSubmit={handleEmployeeSubmit}>
          <div className={styles.inputContainer}>
            <input type="text" name="employeeCode" placeholder="사원 ID" value={form.employeeCode} readOnly />
          </div>
          <button type="submit" className={styles.loginButton}>사원 등록</button>
        </form>
      )}
    </div>
  );
};

export default Admin;
