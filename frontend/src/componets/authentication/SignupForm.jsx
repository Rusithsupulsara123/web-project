import React from 'react';
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { blue } from '@mui/material/colors';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../Store/Auth/Action';

const SignupForm = () => {
 const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      dateOfBirth: {
        day: '',
        month: '',
        year: '',
      },
    },
    validationSchema,
    onSubmit: (values) => {
      const { day, month, year } = values.dateOfBirth;
      values.dateOfBirth = `${year}-${month}-${day}`;
      dispatch(registerUser(values))
      console.log('Form Submitted:', values);
    },
  });

  const handleDateChange = (field) => (event) => {
    formik.setFieldValue('dateOfBirth', {
      ...formik.values.dateOfBirth,
      [field]: event.target.value,
    });
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2} >
        <TextField
          label="Full Name"
          name="fullName"
          variant="outlined"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />

        <TextField
          label="Email"
          name="email"
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Box>
          <InputLabel>Date of Birth</InputLabel>
          <Box display="flex" gap={2} mt={1}>
            <Select
              name="day"
              value={formik.values.dateOfBirth.day}
              onChange={handleDateChange('day')}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Day</MenuItem>
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>

            <Select
              name="month"
              value={formik.values.dateOfBirth.month}
              onChange={handleDateChange('month')}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Month</MenuItem>
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>

            <Select
              name="year"
              value={formik.values.dateOfBirth.year}
              onChange={handleDateChange('year')}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Year</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ bgcolor: blue[500], borderRadius: '29px', py: 1.5 }}
        >
          Sign In
        </Button>
      </Box>
    </form>
  );
};

export default SignupForm;