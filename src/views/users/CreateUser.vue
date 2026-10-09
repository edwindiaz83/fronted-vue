<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const name = ref('');
const email = ref('');
const isSubmitting = ref(false);
const router = useRouter();

async function submit() {
    if (!name.value.trim() || !email.value.trim()) {
        Swal.fire(
            'Campos requeridos',
            'Por favor complete el nombre y el correo electrónico',
            'warning'
        );
        return;
    }
    isSubmitting.value = true;

    try {
        await axios.post('https://jsonplaceholder.typicode.com/users', {
            name: name.value.trim(),
            email: email.value.trim(),
        });

        Swal.fire({
            title: '¡Creado!',
            text: 'Usuario creado con éxito',
            icon: 'success',
            confirmButtonColor: '#059669'
        });
        router.push('/usuarios');
    } catch (error) {
        Swal.fire({
            title: '¡Error!',
            text: 'No se pudo guardar el usuario. Inténtalo de nuevo',
            icon: 'error',
            confirmButtonColor: '#dc2626'
        });
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <div class="max-w-xl mx-auto space-y-6">
        <!--Encabezado con titulo y boton para volver-->
        <div class="flex items-center justify-between gap-4">
            <h3 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa fa-user-plus text-indigo-600"></i>
                <span>Crear Usuario</span>
            </h3>
            <RouterLink 
                to="/usuarios"
                class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900
                bg-slate-100 hover:bg-slate-200 text-sm font-medium px-3.5 py-2 rounded-lg
                transition-colors duration-200"
            >
                <i class="fa fa-arrow-left"></i>
                <span>Volver a la lista</span>
            </RouterLink>
        </div>
        <!--Tarjeta de formulario-->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <form @submit.prevent="submit" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nombre completo</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <i class="fa fa-user"></i>
                        </span>
                        <input
                            v-model="name"
                            type="text"
                            placeholder="Nombres y apellidos"
                            class="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <i class="fa fa-envelope"></i>
                        </span>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="EJ. miemail@email.com"
                            class="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                            required
                        />
                    </div>
                </div>

                <!--Botones de accion-->
                <div class="pt-2 flex items-center justify-end gap-3">
                    <RouterLink 
                        to="/usuarios"
                        class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors duration-150">
                        Cancelar
                    </RouterLink>
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                    <i v-if="isSubmitting" class="fa fa-spinner fa-spin"></i>
                    <i v-else class="fa fa-chaeck"></i>
                    <span>{{ isSubmitting ? 'Guardado...' : 'Guardar usuario' }}</span>
                </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style></style>
