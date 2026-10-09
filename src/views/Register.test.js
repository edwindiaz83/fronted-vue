import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import axios from 'axios';
import Swal from 'sweetalert2';
import Register from '../src/views/Register.vue';

// ---- Mocks ----
vi.mock('axios');

const pushMock = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ params: {}, query: {} }),
  RouterLink: {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
  },
}));

describe('Register.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Render inicial
  it('renderiza el formulario de registro con todos sus campos', () => {
    const wrapper = mount(Register);

    expect(wrapper.find('#name').exists()).toBe(true);
    expect(wrapper.find('#email').exists()).toBe(true);
    expect(wrapper.find('#password').exists()).toBe(true);
    expect(wrapper.find('#confirmPassword').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  // 2. Campos vacíos
  it('no envía el formulario si hay campos vacíos', async () => {
    const wrapper = mount(Register);

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'warning',
      })
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  // 3. Email inválido
  it('muestra error si el email no es válido', async () => {
    const wrapper = mount(Register);

    await wrapper.find('#name').setValue('Juan Pérez');
    await wrapper.find('#email').setValue('correo-invalido');
    await wrapper.find('#password').setValue('12345678');
    await wrapper.find('#confirmPassword').setValue('12345678');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'warning' })
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  // 4. Contraseñas no coinciden
  it('muestra error si las contraseñas no coinciden', async () => {
    const wrapper = mount(Register);

    await wrapper.find('#name').setValue('Juan Pérez');
    await wrapper.find('#email').setValue('juan@example.com');
    await wrapper.find('#password').setValue('12345678');
    await wrapper.find('#confirmPassword').setValue('87654321');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('contraseñas'),
      })
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  // 5. Registro exitoso
  it('registra al usuario correctamente y redirige', async () => {
    axios.post.mockResolvedValueOnce({
      data: { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    });

    const wrapper = mount(Register);

    await wrapper.find('#name').setValue('Juan Pérez');
    await wrapper.find('#email').setValue('juan@example.com');
    await wrapper.find('#password').setValue('12345678');
    await wrapper.find('#confirmPassword').setValue('12345678');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        name: 'Juan Pérez',
        email: 'juan@example.com',
      })
    );

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'success' })
    );
    expect(pushMock).toHaveBeenCalled();
  });

  // 6. Error del servidor
  it('muestra error si el servidor falla', async () => {
    axios.post.mockRejectedValueOnce(new Error('Server Error'));

    const wrapper = mount(Register);

    await wrapper.find('#name').setValue('Juan Pérez');
    await wrapper.find('#email').setValue('juan@example.com');
    await wrapper.find('#password').setValue('12345678');
    await wrapper.find('#confirmPassword').setValue('12345678');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'error' })
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  // 7. Botón deshabilitado mientras envía
  it('deshabilita el botón mientras se envía el formulario', async () => {
    let resolvePost;
    axios.post.mockImplementationOnce(
      () => new Promise((res) => { resolvePost = res; })
    );

    const wrapper = mount(Register);

    await wrapper.find('#name').setValue('Juan Pérez');
    await wrapper.find('#email').setValue('juan@example.com');
    await wrapper.find('#password').setValue('12345678');
    await wrapper.find('#confirmPassword').setValue('12345678');

    await wrapper.find('form').trigger('submit.prevent');

    const boton = wrapper.find('button[type="submit"]');
    expect(boton.attributes('disabled')).toBeDefined();

    resolvePost({ data: {} });
    await flushPromises();

    expect(boton.attributes('disabled')).toBeUndefined();
  });

  // 8. Limpia el formulario tras errores de validación
  it('mantiene los valores escritos tras un error de validación', async () => {
    const wrapper = mount(Register);

    await wrapper.find('#name').setValue('Juan Pérez');
    await wrapper.find('#email').setValue('correo-malo');
    await wrapper.find('#password').setValue('123');
    await wrapper.find('#confirmPassword').setValue('123');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(wrapper.find('#name').element.value).toBe('Juan Pérez');
    expect(wrapper.find('#email').element.value).toBe('correo-malo');
  });
});