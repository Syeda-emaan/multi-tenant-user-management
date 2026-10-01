export const NAME_PATTERN = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/;
export const PHONE_PATTERN = /^[+]?[\d\s-()]{7,20}$/;
export const DEPT_PATTERN = /^[A-Za-z][A-Za-z\s&/-]{1,49}$/;
export const COMPANY_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\s&.,'-]{1,99}$/;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

export const validators = {
  name: (v) => (NAME_PATTERN.test(v) ? '' : 'Name must contain only letters (min 2 characters)'),
  companyName: (v) => (COMPANY_NAME_PATTERN.test(v) ? '' : 'Enter a valid company name'),
  phone: (v) => (!v || PHONE_PATTERN.test(v) ? '' : 'Enter a valid phone number'),
  department: (v) => (!v || DEPT_PATTERN.test(v) ? '' : 'Department must contain only letters'),
  password: (v) => (PASSWORD_PATTERN.test(v) ? '' : 'Min 8 chars, at least one letter and one number'),
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter a valid email address'),
};