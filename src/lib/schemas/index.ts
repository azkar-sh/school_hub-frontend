import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: yup
    .string()
    .oneOf(['TEACHER', 'STUDENT', 'PARENT'], 'Please select a valid role')
    .required('Role selection is required'),
});

export const assessmentSchema = yup.object().shape({
  title: yup
    .string()
    .required('Assessment title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: yup.string().optional(),
  type: yup
    .string()
    .oneOf(['QUIZ', 'EXAM', 'ASSIGNMENT'])
    .required('Assessment type is required'),
  dueAt: yup.string().optional(),
});

export const questionSchema = yup.object().shape({
  question: yup
    .string()
    .required('Question text is required')
    .min(5, 'Question must be at least 5 characters'),
  type: yup
    .string()
    .oneOf(['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER'])
    .required('Question type is required'),
  points: yup
    .number()
    .typeError('Points must be a number')
    .required('Points are required')
    .min(1, 'Points must be at least 1'),
});
