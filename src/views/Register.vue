<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore();

// --- FUNCIONES DE VALIDACIÓN ---

// Valida el formato del correo
const esEmailValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Valida que la contraseña sea fuerte
const esPasswordValido = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

// --- FUNCIÓN DE ENVÍO CORREGIDA ---

const submit = () => {
    // 1. Validar campos vacíos o solo con espacios
    if (!email.value.trim() || !password.value.trim()) {
        return Swal.fire('Error', 'Los campos no pueden estar vacíos ni contener solo espacios.', 'error');
    }

    // 2. Validar Email
    if (!esEmailValido(email.value.trim())) {
        return Swal.fire('Error', 'Ingresa un correo electrónico válido (ejemplo@dominio.com)', 'error');
    }

    // 3. Validar Contraseña (Aquí está el cambio clave)
    // Primero revisamos si tiene espacios en blanco
    if (/\s/.test(password.value)) {
        return Swal.fire('Error', 'La contraseña no puede contener espacios en blanco.', 'error');
    }
    // Luego revisamos las reglas de seguridad
    if (!esPasswordValido(password.value)) {
        return Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.', 'error');
    }

    // --- SI TODO ES VÁLIDO, CONTINÚA TU LÓGICA ORIGINAL ---

    // 4. Guardar usuario temporal
    localStorage.setItem('tempUser', JSON.stringify({
        email: email.value.trim(),
        password: password.value, // La contraseña no se le hace trim porque no debería tener espacios
    }));

    // 5. Iniciar sesión automáticamente
    auth.login(email.value.trim(), password.value);

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
                <label for="password" class="mb-2 block text-sm font-medium text-gray-700">Contraseña</label>
                <input 
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition 
                    placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200"/>
            </div>

            <button 
                type="button"
                @click="submit"
                class="inline-flex items-center rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-green-700
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <i class="fa fa-check mr-2"></i>Registrar
            </button>
        </div>
    </div>
</template>

<style scoped>
</style>