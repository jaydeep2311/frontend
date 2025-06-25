/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react'
import {authAPI } from '../services/api';
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

const AuthContext=createContext();

export const useAuth=()=>{
    const authContext = useContext(AuthContext);

    if(!authContext){
        throw new Error('useAuth is not in provider');
    }

    return authContext;

}

export const AuthProvider=({children}) =>{
    const [user, setUser]=useState(null);
    const [loading, setLoading]=useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));


    useEffect(()=>{
        const initAuth=async () =>{
            const savedToken=localStorage.getItem('token')
            const savedUser = localStorage.getItem('user');

            if(savedToken && savedUser){
             setToken(savedToken);
              setUser(JSON.parse(savedUser))                
            }
            else if(savedToken){
                try {
                    const response=await authAPI.getMe();
                    setUser(response.data.user);
                    setLoading(false);
                    
                } catch (error) {
                    console.log(error)
                    logout();
                }
            }
            setLoading(false)
        }
        initAuth()
    },[])

    const login=async(loginData)=>{
        try{
            const response=await authAPI.login(loginData);
            setUser(response.data.user);
            setLoading(false);
            setToken(response.data.token) 

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return {success:true,response}
        }catch(error){
            console.log(error);
            return {
                success:false,
                error:error?.response?.data?.message || 'Login Failed'
            }
        }
    }

    const register=async(registerData)=>{
        try{
            const response=await authAPI.register(registerData);            

            return { success: true, response }
        }catch(error){
            console.log(error);
            return {
                success:false,
                error:error?.response?.data?.message || 'Register Failed'
            }
        }
    }

    const logout=async()=>{
       setToken(null);
       setUser(null);
       localStorage.removeItem('token');
       localStorage.removeItem('user');
    }


    const authData={
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated:!!token && !!user
    }

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    )
}