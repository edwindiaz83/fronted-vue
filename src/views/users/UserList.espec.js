import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserList from './UserList.vue'; // Asegúrate de poner el nombre correcto de tu archivo

// 1. Mock de dependencias
vi.mock('axios');
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true })
  }
}));

const mockUsers = [
  { id: 1, name: 'Juan Perez', email: 'juan@real.com' },
  { id: 2, name: 'Maria Lopez', email: 'maria@real.com' },
  { id: 3, name: 'Carlos Bot', email: 'carlos@fake.com' }
];

describe('UserList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la lista de usuarios correctamente al cargar', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    const wrapper = mount(UserList, {
      global: {
        stubs: { RouterLink: true } // Evita errores por no tener Vue Router configurado en el test
      }
    });

    // Esperamos a que se resuelva la promesa de axios y el DOM se actualice
    await flushPromises();

    // Verificamos que la tabla tenga 3 filas de usuarios
    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(3);
    expect(wrapper.text()).toContain('Juan Perez');
  });

  it('filtra usuarios al escribir en el buscador', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    const wrapper = mount(UserList, {
      global: { stubs: { RouterLink: true } }
    });
    await flushPromises();

    // Buscamos a "Maria"
    const input = wrapper.find('input[type="text"]');
    await input.setValue('Maria');

    const rows = wrapper.findAll('tbody tr');
    // Solo debe quedar 1 fila
    expect(rows).toHaveLength(1);
    expect(wrapper.text()).toContain('Maria Lopez');
    expect(wrapper.text()).not.toContain('Juan Perez');
  });

  it('elimina un usuario al confirmar el SweetAlert', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    const wrapper = mount(UserList, {
      global: { stubs: { RouterLink: true } }
    });
    await flushPromises();

    // Hacemos clic en el botón de eliminar del primer usuario (Juan)
    const deleteBtn = wrapper.findAll('button[title="Eliminar usuario"]').at(0);
    await deleteBtn.trigger('click');

    // Verificamos que SweetAlert fue llamado
    expect(Swal.fire).toHaveBeenCalled();

    // Al resolverse el Swal mockeado con { isConfirmed: true }, el usuario debe desaparecer
    await flushPromises();
    expect(wrapper.text()).not.toContain('Juan Perez');
  });
});

// Utilidad para esperar que se resuelvan las promesas en Vue
async function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
}