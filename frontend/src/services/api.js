import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('acm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const fetchList = async (resource, params = {}) => {
  const { data } = await api.get(`/${resource}`, { params })
  return data
}

export const fetchOne = async (resource, id) => {
  const { data } = await api.get(`/${resource}/${id}`)
  return data.data
}

export const createItem = async (resource, payload) => {
  const { data } = await api.post(`/${resource}`, payload)
  return data.data
}

export const updateItem = async (resource, id, payload) => {
  const { data } = await api.put(`/${resource}/${id}`, payload)
  return data.data
}

export const deleteItem = async (resource, id) => {
  await api.delete(`/${resource}/${id}`)
}

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const verifyOtp = async (email, otp) => {
  const { data } = await api.post('/auth/verify-otp', { email, otp })
  return data
}

export const submitContact = (payload) => api.post('/contacts', payload)
export const subscribeNewsletter = (payload) => api.post('/newsletter', payload)
export const submitApplication = (payload) => api.post('/applications/public', payload)
export const fetchLive = () => fetchList('live').then((r) => r.data || r)
export const fetchAnalytics = () => fetchList('analytics').then((r) => r.data || r)

export const requestPublishOtp = async (title) => {
  const { data } = await api.post('/events/request-publish-otp', { title })
  return data
}

export const verifyAndPublishEvent = async (event, otp) => {
  const { data } = await api.post('/events/verify-publish-otp', { event, otp })
  return data
}

export const demoLogin = async () => {
  const { data } = await api.post('/auth/demo-login')
  return data
}

export const registerAdmin = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data
}

export const uploadFile = async (filename, fileData) => {
  const { data } = await api.post('/upload', { filename, fileData })
  return data
}

export default api

