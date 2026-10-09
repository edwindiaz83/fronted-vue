import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditUser from '../src/views/users/EditUser.vue';

// ---- Mocks ----
vi.mock('axios');

const pushMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } }),
  useRouter: () => ({ push: pushMock }),
  RouterLink: {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
  },
}));

describe('EditUser.vue', () => {
  const usuarioMock = {
    id: 1,
    name: 'Leanne Graham',
    email: 'leanne@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Carga inicial
  it('carga los datos del usuario al montar el componente', async () => {
    axios.get.mockResolvedValueOnce({ data: usuarioMock });

    const wrapper = mount(EditUser);
    await flushPromises();

    expect(axios.get).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/1'
    );
    expect(wrapper.find('#name').element.value).toBe('Leanne Graham');
    expect(wrapper.find('#email').element.value).toBe('leanne@example.com');
  });

  // 2. Estado de carga
  it('muestra el spinner mientras carga', async () => {
    axios.get.mockResolvedValueOnce({ data: usuarioMock });

    const wrapper = mount(EditUser);
    expect(wrapper.text()).toContain('Cargando información del usuario...');

    await flushPromises();
    expect(wrapper.text()).not.toContain('Cargando información del usuario...');
  });

  // 3. Error al cargar
  it('muestra error y redirige si falla la carga', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    mount(EditUser);
    await flushPromises();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        text: 'No se pudo obtener la información del usuario.',
        icon: 'error',
      })
    );
    expect(pushMock).toHaveBeenCalledWith('/usuarios');
  });

  // 4. Validación de campos vacíos
  it('no envía si los campos están vacíos', async () => {
    axios.get.mockResolvedValueOnce({ data: usuarioMock });

    const wrapper = mount(EditUser);
    await flushPromises();

    await wrapper.find('#name').setValue('');
    await wrapper.find('#email').setValue('');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Campos requeridos',
      'Por favor completa el nombre y el correo electrónico.',
      'warning'
    );
    expect(axios.put).not.toHaveBeenCalled();
  });

  // 5. Envío exitoso
  it('envía los datos correctamente y redirige', async () => {
    axios.get.mockResolvedValueOnce({ data: usuarioMock });
    axios.put.mockResolvedValueOnce({ data: {} });

    const wrapper = mount(EditUser);
    await flushPromises();

    await wrapper.find('#name').setValue('  Nuevo Nombre  ');
    await wrapper.find('#email').setValue('nuevo@example.com');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(axios.put).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/1',
      { name: 'Nuevo Nombre', email: 'nuevo@example.com' }
    );
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Actualizado', icon: 'success' })
    );
    expect(pushMock).toHaveBeenCalledWith('/usuarios');
  });

  // 6. Error al actualizar
  it('muestra error si falla la actualización', async () => {
    axios.get.mockResolvedValueOnce({ data: usuarioMock });
    axios.put.mockRejectedValueOnce(new Error('Error'));

    const wrapper = mount(EditUser);
    await flushPromises();

    await wrapper.find('#name').setValue('Nombre');
    await wrapper.find('#email').setValue('a@a.com');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        text: 'No se pudo actualizar la información del usuario.',
      })
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  // 7. Botón deshabilitado durante el envío
  it('deshabilita el botón mientras se envía', async () => {
    let resolvePut;
    axios.get.mockResolvedValueOnce({ data: usuarioMock });
    axios.put.mockImplementationOnce(
      () => new Promise((res) => { resolvePut = res; })
    );

    const wrapper = mount(EditUser);
    await flushPromises();

    await wrapper.find('#name').setValue('Nombre');
    await wrapper.find('#email').setValue('a@a.com');
    await wrapper.find('form').trigger('submit.prevent');

    const boton = wrapper.find('button[type="submit"]');
    expect(boton.attributes('disabled')).toBeDefined();
    expect(boton.text()).toContain('actualizando...');

    resolvePut({ data: {} });
    await flushPromises();

    expect(boton.attributes('disabled')).toBeUndefined();
  });
});