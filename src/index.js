import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from './App';
import { BoardIndex, BoardEdit, BoardDetail } from './pages/Board_jongho';
import Mailbox from './components/Mailbox/Mailbox';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Board/*" element={<BoardIndex/>} />
        <Route path="/mailbox/*" element={<Mailbox/>}/>
      </Routes>
    </BrowserRouter>
);
reportWebVitals();
