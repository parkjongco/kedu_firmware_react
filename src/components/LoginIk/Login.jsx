import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/store';
import styles from './Login.module.css';



axios.defaults.withCredentials = true;

const Login = ({ setIsMypage }) => {
  const { loginID, setLoginID } = useAuthStore();
  const navigate = useNavigate();

  const [auth, setAuth] = useState({ users_code: '', users_password: '' });
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    sessionStorage.setItem('isAdmin', isAdmin);
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    console.log("로그인 시도 중:", auth);


    axios.post(`http://192.168.1.10/auth`, auth)


      .then((resp) => {
        console.log("서버 응답:", resp.data);
        const { users_code, users_is_admin } = resp.data;
        sessionStorage.setItem("loginID", users_code);
        setLoginID(users_code);
        setIsAdmin(users_is_admin === 1);
        alert("로그인 성공");
        navigate("/users/login");
      })
      .catch((err) => {
        console.error("로그인 오류:", err);
        if (err.response && err.response.status === 401) {
          alert("사원 코드 또는 패스워드를 다시 확인해주세요.");
        } else {
          alert("서버 오류가 발생했습니다. 관리자에게 문의하세요.");
        }
      });
  };

  const handleLogout = () => {


    axios.post(`http://192.168.1.10/auth/logout`)


      .then(() => {
        console.log("로그아웃 성공");
        sessionStorage.removeItem("loginID");
        sessionStorage.removeItem("isAdmin");
        setLoginID('');
        setAuth({ users_code: '', users_password: '' });
        setIsAdmin(false);
        alert("로그아웃 성공");
        navigate("/users/login");
      })
      .catch((err) => {
        console.error("로그아웃 오류:", err);
        alert("로그아웃 실패");
      });
  };

  const handleMemberout = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) {
      return;
    }

    axios.delete(`http://192.168.1.10/users`)


      .then(() => {
        console.log("회원 탈퇴 성공");
        sessionStorage.removeItem("loginID");
        setLoginID('');
        setAuth({ users_code: '', users_password: '' });
        setIsAdmin(false);
        alert("회원 탈퇴 성공");
        navigate("/users/login");
      })
      .catch((err) => {
        console.error("회원 탈퇴 오류:", err);
        alert("회원 탈퇴 실패");
      });
  };

  const handleDeleteUser = () => {
    navigate("/admin/deleteuser");
  };

  const handleUserRegister = () => {
    navigate("/admin");
  };

  // New function to handle external navigation
  const handleGoToHome = () => {

    window.location.href = "http://192.168.1.10:3000/"; // Directly navigate to the main homepage


  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.title}>Firmware</div>
      <div className={styles.loginForm}>
        <div className={styles.tabs}>
          <span className={loginID ? '' : styles.active}>{loginID ? '환영합니다' : '로그인'}</span>
        </div>
        {loginID ? (
          <>
            <div className={styles.welcomeMessage}>
              <span className={styles.userName}><strong>{loginID}</strong> 님 환영합니다.</span>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.actionButton} onClick={handleLogout}>로그아웃</button>
              <button className={styles.actionButton} onClick={handleMemberout}>회원탈퇴</button>
              {isAdmin && (
                <>
                  <button className={styles.actionButton} onClick={handleUserRegister}>유저 & 사원 등록</button>
                  <button className={styles.actionButton} onClick={handleDeleteUser}>사원 제명</button>
                </>
              )}

              <button className={styles.actionButton} onClick={handleGoToHome}>메인 페이지로 이동</button> {/* New button */}

            </div>
          </>
        ) : (
          <>
            <div className={styles.inputContainer}>
              <input type="text" name="users_code" placeholder="사원 코드 입력" value={auth.users_code} onChange={handleChange}/> 
              <input type="password" name="users_password" placeholder="비밀번호 입력" value={auth.users_password} onChange={handleChange}/>
            </div>
            <button className={styles.loginButton} onClick={handleLogin}>로그인</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
