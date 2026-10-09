import { defineStore } from "pinia";

const getSavedUser = () => {
    try {
        const item = localStorage.getItem('sessionUser');
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

export const useAuthStore = defineStore('auth', {
    state: () => {
        const user = getSavedUser();
        return {
            user,
            isLogged: !!user
        };
    },
    actions: {
        login(email, password) {
            const tmp = JSON.parse(localStorage.getItem('tempUser'))
            if (tmp && tmp.email == email && tmp.password === password) {
                this.user = tmp
                this.isLogged = true
                localStorage.setItem('sessionUser', JSON.stringify(tmp))
                return true;
            }
            return false;
        },
        logout() {
            this.user = null;
            this.isLogged = false;
            localStorage.removeItem('sessionUser');
        }
    }
});