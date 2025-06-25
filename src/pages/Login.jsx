import React from 'react'
import FormField from '../components/FormField'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {  toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useEffect } from 'react'

const Login = () => {
    const {login,isAuthenticated} =useAuth();
    const navigate=useNavigate();

    const loginSchema=Yup.object({
        email:Yup.string().email('Please enter  valid email address').required('Email is required'),
        password:Yup.string().min(6,'Password must be at least 6 characters').required('Password is required')
    })

    const handleSubmit=async (values,{setSubmitting,setStatus})=>{
        setStatus('');
        const result=await login(values)
        if(result.success){
            toast.success('Login successful')
            navigate('/dashboard')
        }
        else{
            setStatus(result.error);
            toast.error(result.error);
        }
        setSubmitting(false);
    }

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/dashboard')
        }
    },[isAuthenticated])
    return (
      <div className='auth-container'>
        <div className='auth-card'>
          <h2>Login to Notes App </h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className='auth-form'>
                {status && <div className='error-message'>{status} </div>}
                <FormField
                  label='Email'
                  name='email'
                  type='email'
                  placeholder='Enter your email'
                />

                <FormField
                  label='Password'
                  name='password'
                  type='password'
                  placeholder='Enter your Password'
                />

                <button
                  type='submit'
                  className='auth-button'
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>

          <p className='auth-link'>
            Don't have an account? <Link to='/register'>Signup</Link>
          </p>
        </div>
      </div>
    )
}

export default Login