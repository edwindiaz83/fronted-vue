<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const userId = route.params.id;
const name = ref('');
const email = ref('');

const isLoading = ref(true);
const isSubmitting = ref(false);

// Obtener los datos del usuario al cargar la vista
onMounted(async () => {
    try {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
        name.value = data.name;
        email.value = data.email;
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo obtener la información del usuario.',
            icon: 'error',
            confirmButtonColor: '#dc2626'
        });
        router.push('/usuarios');
    } finally {
        isLoading.value = false;
    }
});

// Función para guardar los cambios
async function submit() {
    if (!name.value.trim() || !email.value.trim()) {
        Swal.fire('Campos requeridos', 'Por favor completa el nombre y el correo electrónico.', 'warning');
        return;
    }

    isSubmitting.value = true;
    try {
        await axios.put(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            name: name.value.trim(),
            email: email.value.trim(),
        });
        await Swal.fire({
            title: 'Actualizado',
            text: 'Usuario actualizado con éxito',
            icon: 'success',
            confirmButtonColor: '#4f46e5'
        });
        router.push('/usuarios');
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar la información del usuario.',
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
        <!-- Encabezado con título y botón para volver -->
        <div class="flex items-center justify-between gap-4">
            <h3 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa fa-user-pen text-indigo-600"></i>
                <span>Editar Usuario</span>
            </h3>
            <RouterLink
                to="/usuarios"
                class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors duration-200"
            >
                <i class="fa fa-arrow-left"></i>
                <span>Volver a la lista</span>
            </RouterLink>
        </div>

        <!-- Estado de carga -->
        <div v-if="isLoading" class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
            <i class="fa fa-spinner fa-spin text-3xl text-indigo-600 mb-3"></i>
            <p class="text-sm font-medium">Cargando información del usuario...</p>
        </div>

        <!-- Tarjeta de formulario -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <form @submit.prevent="submit" class="space-y-4">
                <!-- Campo Nombre -->
                <div>
                    <label for="name" class="block text-sm font-semibold text-slate-700 mb-1.5">
                        Nombre completo:
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <i class="fa fa-user"></i>
                        </span>
                        <input
                            id="name"
                            v-model="name"
                            type="text"
                            placeholder="Nombre y Apellido"
                            class="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                            required
                        />
                    </div>
                </div>

                <!-- Campo Email -->
                <div>
                    <label for="email" class="block text-sm font-semibold text-slate-700 mb-1.5">
                        Correo electrónico:
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <i class="fa fa-envelope"></i>
                        </span>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="micorreo@gmail.com"
                            class="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                            required
                        />
                    </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex items-center justify-end gap-3 pt-2">
                    <RouterLink
                        to="/usuarios"
                        class="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Cancelar
                    </RouterLink>
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        <i v-if="isSubmitting" class="fa fa-spinner fa-spin"></i>
                        <i v-else class="fa fa-save"></i>
                        <span>{{ isSubmitting ? 'actualizando...' : 'actualizar usuario'}} </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>