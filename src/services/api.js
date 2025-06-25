import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        'Content-Type':'application/json'
    }
});


api.interceptors.request.use((config)=>{
   const token=localStorage.getItem('token');
   if(token){
    config.headers.Authorization=`Bearer ${token}`;
   }
   return config; 
})

api.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    if(error.response.status===401){
        localStorage.removeItem('token');
        window.location.href='/login';
    }
    return Promise.reject(error);
})


export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getMe:()=>api.get('/auth/me')
}

export const notesAPI = {
  getNotes: () => api.get('/notes'),
  getNoteDetailById: (id) => api.get(`/notes/register/${id}`),
  createNote: (noteDetail) => api.post('/notes', noteDetail),
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),
  deleteNote: (id) => api.delete(`/notes/${id}`),
}

export default api;