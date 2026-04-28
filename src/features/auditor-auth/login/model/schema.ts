import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().required('Введите логин или email'),
  password: yup.string().required('Введите пароль').min(6,'vbsss'),
});
