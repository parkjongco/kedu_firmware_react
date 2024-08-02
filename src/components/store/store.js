import { create } from 'zustand';
import axios from 'axios';

export const useMailStore = create((set)=>({
    mails: [],
    selectedMailContent: [],
    selectedMailSeq: null,
  
    setMails: (mails) => set({ mails }),
    setSelectedMailContent: (content) => set({ selectedMailContent: content }),
    setSelectedMailSeq: (seq) => set({ selectedMailSeq: seq }),

    handleGetAll: () => {
        console.log("모든 메일을 불러옵니다")
        axios.get(`http://192.168.1.36/mail`).then((resp) => { //객체배열 가져옴
          // console.log(resp.data); //객체 배열의 데이터만 콘솔 로그
          // console.log("서버와 접근완료")
          // console.log("받은데이터:",resp.data);
          set({ mails: resp.data });
        
        });
      },

    handleGetPage: (page = 1, size = 10) => {
    console.log(`페이지 ${page}의 메일을 ${size}개 불러옵니다`);
    axios.get(`http://192.168.1.36/mail`, { params: { page, size } }).then((resp) => {
      set({ mails: resp.data });
    });
  },

}));