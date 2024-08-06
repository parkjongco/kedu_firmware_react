import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    loginID: '',
    usersName: '', // 추가된 필드
    setLoginID: (param) => set({ loginID: param }),
    setUsersName: (param) => set({ usersName: param }), // 추가된 메서드
}));
