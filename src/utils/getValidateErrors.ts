import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidateError(errs: ValidationError): Errors {
  const validationErros: Errors = {};

  errs.inner.forEach(err => {
    validationErros[err.path] = err.message;
  });

  return validationErros;
}
