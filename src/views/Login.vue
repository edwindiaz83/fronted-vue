<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore();

function submit(){
    if(!email.value  || !password.value){
        Swal.fire({
        title:'Error',
        text:'Completa los campos',
        icon:'warning'
        });
        return
    }
    const ok = auth.login(email.value, password.value);
    if (ok) router.push('/usuarios');
    else Swal.fire({
        title:'Error',
        text:'Credenciales invalidas, usa resgistro temporal o crea un usuario.',
        icon:'warning'
    })
};


</script>
<template>
    <div class="max-w-xl mx-auto mt-12 px-4">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">Iniciar Sesión<i class="fa fa-right-to-bracket ml-1"></i></h2>
             <div class="mb-4">
                <label class="mb-2 block text-sm font-medium text-gray-700" for="email">Email</label>
                
                <input v-model="email" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none 
                transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="email@example.com"/>
            </div>
            <div class="mb-5">
                <label class="mb-2 block text-sm font-medium text-gray-700" for="password">Contraseña</label>

                <input v-model="password" type="password" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 
                shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"/>
            </div>
            <div class="flex gap-2">
                <button class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" @click="submit"><i class="fa fa-sign-in-alt me-3"></i>Entrar</button>

                <router-link to="/register" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium 
                text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ml-3"
                >Registro</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>