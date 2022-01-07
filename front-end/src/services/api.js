import axios from 'axios'

const api = axios.create({
    baseURL: "http://43f8-179-125-116-54.ngrok.io"
})

export default api
