import React, { useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import {BoardIndex, BoardEdit, BoardDetail} from './pages/Board_jongho';
import Mailbox from './components/Mailbox/Mailbox';
import Messenger from './pages/Messenger/Messenger';
import Login from './components/LoginIk/Login';
import Admin from './components/LoginIk/Admin/Admin';
import DeleteUser from './components/LoginIk/Admin/DeleteUser';
import Mypage from './components/Mypage/Mypage';
import Calendar from './components/Calendar/Calendar';
import Attendance from './components/Attendance/Attendance';

import './App.css';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AppLayout = ({ children }) => (
  <div className="app">
    <Header />
    <div className="container">
      <Sidebar />
      <main>
        {children}
      </main>
    </div>
  </div>
);

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginID = sessionStorage.getItem('loginID');
    if (!loginID) {
      navigate('/users/login');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<AppLayout><MainContent /></AppLayout>} />
      <Route path="/Attendance/*" element={<Attendance />} />
      <Route path="/Board" element={<BoardIndex />} />
      <Route path="/BoardEdit" element={<BoardEdit />} />
      <Route path="/BoardDetail" element={<BoardDetail />} />
      <Route path="/mailbox/*" element={<Mailbox />} />
      <Route path="/messenger" element={<Messenger />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/deleteuser" element={<DeleteUser />} />
      <Route path="/users/login" element={<Login />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/Calendar" element={<Calendar />} />
    </Routes>
  );
};

export default App;
