import axios from 'axios'

const api = axios.create({
    baseURL: "https://43f8-179-125-116-54.ngrok.io"
})

export default api
