import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from './App';
import { NoticeIndex, NoticeEdit, NoticeDetail } from './pages/Notice_jongho';
import Mailbox from './components/Mailbox/Mailbox';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> //useEffect 두번 호출되서 지워둠
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Notice/*" element={<NoticeIndex/>} />
        <Route path="/mailbox/*" element={<Mailbox/>}/>
      </Routes>
    </BrowserRouter>
  // </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
