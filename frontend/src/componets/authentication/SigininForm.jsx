import { Button, Grid, TextField } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { loginUser } from '../../Store/Auth/Action'
import { useNavigate } from 'react-router-dom'

const SigininForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().required("Password is required")
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await dispatch(loginUser(values));
                
                if (result.success) {
                    navigate("/home");
                } else {
                    setError(result.error || "Login failed. Please try again.");
                }
            } catch (error) {
                console.error("Login error:", error);
                setError("An error occurred during login. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    })

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            formik.handleSubmit();
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
                {error && (
                    <Grid item style={{ width: "100%" }}>
                        <div className="text-red-500 text-sm mb-2">{error}</div>
                    </Grid>
                )}
                <Grid item style={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name='email'
                        variant='outlined'
                        size='large'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onKeyPress={handleKeyPress}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        disabled={isLoading}
                    />
                </Grid>

                <Grid item style={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        label="Password"
                        name='password'
                        type='password'
                        variant='outlined'
                        size='large'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onKeyPress={handleKeyPress}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        disabled={isLoading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            }
                        }}
                    />
                </Grid>
                <Grid item style={{ width: "100%" }}>
                    <Button 
                        sx={{
                            borderRadius: "29px", 
                            py: "15px", 
                            bgcolor: blue[500]
                        }} 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        size="large"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default SigininForm








