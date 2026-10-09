<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore();

const submit = () => {
    if (!email.value || !password.value)
        return Swal.fire('Error','Completa los campos', 'error');

    // 1. Guardar usuario temporal
    localStorage.setItem('tempUser', JSON.stringify({
        email: email.value,
        password: password.value,
    }));

    // 2. Iniciar sesión automáticamente
    auth.login(email.value, password.value);

    Swal.fire('OK', 'Registrado e inicio de sesión exitoso', 'success').then(() => {
        router.push('/usuarios');
    });
};
</script>

<template>
    <div class="max-w-xl mx-auto mt-12 px-4">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">Registro temporal</h2>
            <div class="mb-4">
                <label for="email" class="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input 
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="email@example.com"
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition 
                    placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200">
            </div>
            <div class="mb-5">
                <label for="password"
                        class="mb-2 block text-sm font-medium text-gray-700">Contraseña</label>
                <input 
                    id="password"
                    v-model="password"
                    type="password"
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition 
                    placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200"/>
            </div>
            <button 
                type="button"
                @click="submit"
                class="inline-flex items-center rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-green-700
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"><i class="fa fa-check mr-2"
                ></i>Registrar
            </button>
        </div>
    </div>
</template>

<style scoped>

</style>