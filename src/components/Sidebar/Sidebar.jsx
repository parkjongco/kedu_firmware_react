import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.user}>
        사용자 출력 부분
      </div>
      <div className={styles.menu}>
        <ul>
          <li><a href="#공지사항">&#128203; 공지사항</a></li>
          <li><a href="#게시판">&#128204; 게시판</a></li>
          <li><a href="#일정">&#128467; 일정</a></li>
          <li><a href="#메일함">&#128231; 메일함</a></li>
          <li><a href="#전자결재">&#128221; 전자결재</a></li>
          <li><a href="#메신저">&#128172; 메신저</a></li>
          <li><a href="#파일관리">&#128193; 파일관리</a></li>
          <li><a href="#마이페이지">&#128193; 마이페이지</a></li>
          <li><a href="#로그인">&#128274; 로그인 / 로그아웃</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
