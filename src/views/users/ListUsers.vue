<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import swal from 'sweetalert2';
// --- IMPORTACIÓN PARA EXCEL ---
import * as XLSX from 'xlsx';

const users = ref([]);
const searchQuery = ref('');

const er = ref(false);
const dataError = ref('');
//Variables de paginacion
const currentPage = ref(1);
const itemsPerPage = ref(5); //5, 10, 20

//Reiniciar a la pagina cuando el usuario cambia la cantidad por pagina
watch([itemsPerPage, searchQuery], () => {
    currentPage.value = 1;
})

onMounted(async () => {
    try{
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
        users.value = data;
    } catch (error){
        er.value = true;
        dataError.value = error.message || 'No se pudo conectar con el servidor';
    }
});

//filtrar los usuarios según el texto de búsqueda(nombre o email)
const filteredUsers = computed(() =>{
    if(!searchQuery.value.trim()) return users.value;
    const query = searchQuery.value.toLowerCase().trim();
    return users.value.filter( u =>
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
    );
});

//Calculos para la paginacion (Reactiva)
const totalPages = computed(()=>{
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1
});
const startIndex = computed(()=>{
    return (currentPage.value -1) * itemsPerPage.value;
});
const endIndex = computed(()=>{
    return startIndex.value + itemsPerPage.value;
});

//subarreglo que se muestra en la tabla
const paginatedUsers = computed(()=>{
    return filteredUsers.value.slice(startIndex.value, endIndex.value);
});

//funciones de navegacion
const nextPage = () => {
    if(currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
    if(currentPage.value > 1) currentPage.value--;
};
const goToPage = (page) => {
    currentPage.value = page;
};

// --- FUNCIÓN PARA EXPORTAR A EXCEL ---
const exportToExcel = () => {
    // 1. Preparamos los datos con encabezados en español y centrado
    // Usamos 'filteredUsers' para que respete la búsqueda actual
    const dataToExport = filteredUsers.value.map(user => ({
        "Identificación": user.id,
        "Nombre": user.name,
        "Correo Electrónico": user.email
    }));

    // 2. Convertimos los datos a una hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // 3. CENTRAR EL TEXTO EN LAS CELDAS
    // Obtenemos el rango de celdas (ej. A1:C11)
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Recorremos todas las celdas para aplicarles alineación centrada
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            
            if (!worksheet[cellRef]) continue; // Si la celda está vacía, saltar
            
            // Aplicar estilo de centrado horizontal
            worksheet[cellRef].s = {
                alignment: { horizontal: "center", vertical: "center" }
            };
        }
    }

    // 4. Ajustar el ancho de las columnas automáticamente
    // Calculamos el ancho máximo de cada columna
    const colWidths = [
        { wch: 15 }, // Ancho para ID
        { wch: 30 }, // Ancho para Nombre
        { wch: 35 }  // Ancho para Email
    ];
    worksheet['!cols'] = colWidths;

    // 5. Creamos el libro de trabajo y añadimos la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    // 6. Guardamos el archivo
    XLSX.writeFile(workbook, "usuarios.xlsx");
};

function remove(id) {
    swal.fire({
        title: "Eliminar",
        text: 'Eliminar Usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'Cancelar'

    }).then((res)=>{
        if(res.isConfirmed){
            users.value = users.value.filter(user => user.id !== id)
            //Reajustar página si la actual queda vacia
            if(currentPage.value > totalPages.value){
                currentPage.value = totalPages.value;
            }
            swal.fire('Eliminado', 'Usuario Eliminado', 'success');    
        }
    });
};
</script>

<template>
    <div class="space-y-6">
        <!--Encabezado con titulo y un boton de accion-->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 class="text-2x1 font-bold text-slate-800 flex items-center gap-2">
                <i class="fa fa-users text-indigo-600"></i>
                <span>Usuarios</span>
            </h3>
            
            <!-- CONTENEDOR DE BOTONES -->
            <div class="flex gap-2">
                <!-- BOTÓN DE EXCEL (VERDE) -->
                <button
                    @click="exportToExcel"
                    class="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-800 text-white 
                    font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus-ring-2 
                    focus:ring-green-500 focus:ring-offset-2"
                >
                    <i class="fa fa-file-excel"></i>
                    <span>Excel</span>
                </button>

                <!-- TU BOTÓN EXISTENTE DE NUEVO -->
                <RouterLink
                    to="/usuarios/crear"
                    class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-800 text-white 
                    font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus-ring-2 
                    focus:ring-emerald-500 focus:ring-offset-2"
                    >
                    <i class="fa fa-plus"></i>
                    <span>Nuevo</span>
                </RouterLink>
            </div>
        </div>
        <!--Tarjeta contenedora de la tabla de usuarios-->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <!--Selector de Regisro por página 5,10,20 y busqueda-->
            <div class="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 text-sm text-slate-600">
                <!-- Selectro de registros -->
                <div class="flex items-center gap-2 w-full md:w-auto">
                    <span>Mostrar</span>
                    <select 
                    v-model="itemsPerPage"
                    class="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2
                    focus:ring-indigo-500 focus:border-indigo-500 shadow-xs cursor-pointer"
                    >
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                    </select>
                    <span>Registros por pagina</span>
                    <span class=" ml-auto text-xs font-medium text-slate-500 hidden sm:inline">
                        Mostrando {{ filteredUsers.length > 0 ? startIndex + 1: 0 }} - {{ Math.min
                        (endIndex, filteredUsers.length) }} de {{ filteredUsers.length }}
                    </span>
                </div>
                <!-- Input de busqueda -->
                 
                    <div class="relative w-full md:w-72 mt-2">
                        <span class="absolute inset-y-0 left-0 flex items-center
                         pl-3 pointer-events-none text-slate-400">
                            <i class="fa fa-search"></i>
                        </span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Buscar..."
                            class="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 text-sm focus-outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 shadow-xs transition-all"
                        />
                        <button
                            v-if="searchQuery" 
                            @click="searchQuery = ''"
                            class="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                            title="Limpiar búsqueda"
                        >
                            <i class="fa fa-times-circle"></i>
                        </button>
                    </div>

                
            </div>
            <!-- Tabla de datos de usuarios -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-500 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            <th class="py-3.5 px-4">ID</th>
                            <th class="py-3.5 px-4">Nombre</th>
                            <th class="py-3.5 px-4">Email</th>
                            <th class="py-3.5 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 text-sm text-slate-700">
                        <tr v-for="user in paginatedUsers" :key="user.id"
                        class="hover:bg-slate-50/80 transition-colors duration-150">

                            <td class="py-3.5 px-4 font-mono font-medium text-slate-500">{{ user.id }}</td>
                            <td class="py-3.5 px-4 font-medium">{{ user.name }}</td>
                            <td class="py-3.5 px-4 text-slate-900">{{ user.email }}</td>
                            <td class="py-3.5 px-4">
                                <div class="flex items-center justify-end gap-2">
                                    <RouterLink
                                    :to="`/usuarios/${user.id}/editar`"
                                    class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-150 cursor-pointer"
                                    title="Editar usuario"
                                    >
                                        <i class="fa fa-edit text-base"></i>
                                    </RouterLink>
                                    <button
                                    class="p-2 bg-red-50 hover:bg-red-100 text-red-800 rounded-lg transition-colors duration-150 cursor-pointer"
                                    title="Eliminar usuario" @click="remove(user.id)"
                                    >
                                        <i class="fa fa-trash text-base"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <!-- Estado cuando la búsqueda no arroja resultados -->
                        <tr v-if="filteredUsers.length === 0 && !er">
                            <td colspan="4" class="py-8 text-center text-slate-400">
                                <span v-if="searchQuery">No se encontraron 
                                conincidencias con "{{ searchQuery }}"</span>
                                <span v-else>No hay usuarios registrados!</span>
                            </td>
                        </tr>
                        <!-- Estado de error del servidor/red-->
                        <tr v-if="er">
                            <td colspan="4" class="py-8 text-center text-red-800 bg-red-200">
                                <i class="fa fa-solid fa-exclamation-circle text-lg"></i>
                                <span> Error al cargar usuarios, {{ dataError }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <!-- Footer con páginador -->
            <div v-if="totalPages > 1 && !er" class="p-4 border-t border-salte-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span class="text-sm text-slate-600">
                    Página <span class="font-semibold text-slate-900">{{ currentPage }}</span> de
                    <span class="font-semibold text-slate-900">{{ totalPages }}</span>
                </span>
                <!-- Botones de navegación -->
                <div class="inline-flex items-center gap-1">
                    <button 
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center gap-1"
                    >
                        <i class="fa fa-chevron-left text-xs"></i>
                        <span>Anterior</span>
                    </button>
                    <button 
                        v-for="page in totalPages"
                        :key="page"
                        @click="goToPage(page)"
                        :class="['px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer', currentPage === page ? 'bg-indigo-600 text-white  font-semibold shadow-xs' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100']"
                    >
                {{ page }}
            </button>
                    <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center gap-1"
                    
                    >
                        <span>Siguiente</span>
                        <i class="fa fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>