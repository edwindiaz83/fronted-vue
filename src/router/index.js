import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import UsersList from "../views/users/ListUsers.vue";
import UserEdit from "../views/users/EditUser.vue";
import UserCreate from "../views/users/CreateUser.vue";
import { useAuthStore } from "../stores/auth.js";

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: "/register",
        name: "register",
        component: Register,
    },
    {
        path: "/usuarios",
        name: "usuarios",
        component: UsersList
    },
    {
        path: "/usuarios/:id/editar",
        name: "userEdit",
        component: UserEdit, 
        meta: {requiresAuth: true}
    },
    {
        path: "/usuarios/crear",
        name: "crear",
        component: UserCreate,
        meta: {requiresAuth: true}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to) => {
    const auth = useAuthStore();
    if(to.meta.requiresAuth && !auth.isLogged) return '/'
});

export default router;