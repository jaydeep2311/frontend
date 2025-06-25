import React from 'react'
import FormField from '../components/FormField'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {  toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useEffect } from 'react'

const Register = () => {
    const { register ,isAuthenticated} = useAuth()
    const navigate=useNavigate();

    const registerSchema=Yup.object({
        email:Yup.string().email('Please enter  valid email address').required('Email is required'),
        password:Yup.string().min(6,'Password must be at least 6 characters').required('Password is required'),
        username:Yup.string().min(3,'Username must be at least 3 characters').required('Username is required')  ,
        confirmPassword:Yup.string().oneOf([Yup.ref('password'),''], 'Passwords must match').required('Confirm Password is required')
    })

    const handleSubmit=async (values,{setSubmitting,setStatus})=>{
        setStatus('');
        const result=await register({
            username:values.username,
            email:values.email,
            password:values.password
        })
        if(result.success){
            toast.success('Account created successfully')
            navigate('/login')
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
          <h2>Register to Notes App </h2>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className='auth-form'>
                {status && <div className='error-message'>{status} </div>}
                <FormField
                  label='Username'
                  name='username'
                  type='text'
                  placeholder='Enter your username'
                />

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
                <FormField
                  label='Confirm Password'
                  name='confirmPassword'
                  type='password'
                  placeholder='Confirm your Password'
                />

                <button
                  type='submit'
                  className='auth-button'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign up'}
                </button>
              </Form>
            )}
          </Formik>
          <p className='auth-link'>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </div>
      </div>
    )
}

export default Register