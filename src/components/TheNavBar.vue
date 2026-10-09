<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';

//Estado para el menu desplegable movil
const isOpen = ref(false);

//Instanciar del store y del router
const authStore = useAuthStore();
const router = useRouter();

//Extraer las propiedades reactivas del estado storeToRefs
const { isLogged, user } = storeToRefs(authStore);
//Extraemos la accion logout, directamente desde la tienda
const { logout } = authStore;

const handleLogout = () => {
    logout();
    isOpen.value = false;
    router.push('/');
};

</script>

<template>
    <nav class="bg-slate-900 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Brand Marca/Logo -->
                <RouterLink to="/usuarios" class="flex items-center gap-2 font-bold text-lg text-white hover:text-slate-200">
                    <i class="fa fa-graduation-cap text-xl"></i>
                    <span>Academico</span>
                </RouterLink>
                <!-- Boton Hamburguesa Movil -->
                <button
                @click="isOpen = !isOpen"
                class="md:hidden p-2 rounded-md hover:bg-slate-800 text-slate-300 focus:outline-none">
                    <i :class="isOpen ? 'fa fa-xmark text-xl' : 'fa fa-bars text-xl'"></i>
                </button>
                <!-- Menu Desktop -->
                <div class="hidden md:flex items-center gap-4">
                    <RouterLink 
                    to="/usuarios" 
                    class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 text-slate-200">
                        <i class="fa fa-users"></i>
                        <span>Usuarios</span>
                    </RouterLink>
                    <!-- Si no esta logeado -->
                    <RouterLink 
                    v-if="!isLogged"
                    to="/" 
                    class="flex items-center gap-2 px-3 py-2 rounded-md text-lg font-medium text-slate-200 hover:bg-slate-800 transition-colors duration-200">
                        <i class="fa fa-right-to-bracket"></i>
                        <span>Login</span>
                    </RouterLink>
                    <!-- Si esta logeado -->
                    <div v-else class="flex items-center gap-3">
                        <span class="text-lg font-medium text-slate-200 flex items-center gap-2">
                            <i class="fa fa-user-circle text-lg text-slate-400"></i>
                            <span>{{ user?.email }}</span>
                        </span>
                        <button @click="handleLogout"
                        class="flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors duration-200 focus:outline-none focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer">
                        <i class="fa fa-sign-out-alt"></i>
                        <span>salir</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Menu Mobile con transicion suave-->
        <Transition name="slide-fade">
            <div v-if="isOpen" class="md:hidden px-2 pt-2 pb-3 space-y-1 bg-slate-800 overflow-hidden">
                <RouterLink
                to="/usuarios"
                @click="isOpen = false"
                class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700 transition-colors duration-200">
                    <i class="fa fa-users"></i>
                    <span>Usuarios</span>
                </RouterLink>
                <!-- Autenticacion Movil -->
                <div class="pt-2 pb-1 border-t border-slate-700 mt-2 space-y-1">
                    <!-- Si no esta logeado -->
                    <RouterLink
                    v-if="!isLogged"
                    to="/"
                    @click = "isOpen = false"
                    class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700 transition-colors duration-200"
                    >
                    <i class="fa fa-right-to-bracket"></i>
                    <span>Login</span>
                    </RouterLink>
                    <!-- Si esta logeado -->    
                    <div v-else class="px-3 py-2 space-y-2 ">
                        <div class="flex items-center gap-2 text-lg font-medium text-slate-200">
                            <i class="fa fa-user-circle text-base text-slate-400"></i>
                            <span>{{ user?.email }}</span>
                        </div>
                        <button
                        @click="handleLogout"
                        class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-lg font-medium py-2 rounded-md transition-colors duration-200 cursor-pointer"
                        >
                        <i class="fa fa-sign-out-alt"></i>
                        <span>Salir</span>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<style scoped>
.slide-fade-enter-active{
    transition: all 0.8s ease-out;
}
.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to{
    transform: translateY(-10px);
    opacity: 0;
    max-height: 0;
}
.slide-fade-enter-to, .slide-fade-leave-from{
    transform: translateY(0);
    opacity: 1;
    max-height: 300px;
}
</style>