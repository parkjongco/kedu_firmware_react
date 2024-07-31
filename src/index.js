import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
<<<<<<< HEAD
<<<<<<< HEAD
import App from './App';
import reportWebVitals from './reportWebVitals';
=======
=======
>>>>>>> a574bd1c6534669858ef6abc79f40da945378dbf
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from './App';
import { NoticeIndex, NoticeEdit, NoticeDetail } from './pages/Notice_jongho';
<<<<<<< HEAD
<<<<<<< HEAD
import Mailbox from './components/Mailbox/Mailbox';
>>>>>>> 9f815757b006796e7c8873034f5308ce52bf2f2d
=======
>>>>>>> a574bd1c6534669858ef6abc79f40da945378dbf
=======
import Mailbox from './components/Mailbox/Mailbox';
>>>>>>> 9f815757b006796e7c8873034f5308ce52bf2f2d

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
<<<<<<< HEAD
    <App />
  </React.StrictMode>
);

=======
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Notice/*" element={<NoticeIndex/>} />
        <Route path="/mailbox/*" element={<Mailbox/>}/>
=======
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
<<<<<<< HEAD
        <Route path="/Notice" element={<NoticeIndex/>} />
        <Route path="/Notice/Edit" element={<NoticeEdit/>} />
        <Route path="/Notice/Detail" element={<NoticeDetail/>} />
>>>>>>> a574bd1c6534669858ef6abc79f40da945378dbf
=======
        <Route path="/Notice/*" element={<NoticeIndex/>} />
        <Route path="/mailbox/*" element={<Mailbox/>}/>
>>>>>>> 9f815757b006796e7c8873034f5308ce52bf2f2d
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
<<<<<<< HEAD
>>>>>>> 9f815757b006796e7c8873034f5308ce52bf2f2d
=======
>>>>>>> a574bd1c6534669858ef6abc79f40da945378dbf
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
