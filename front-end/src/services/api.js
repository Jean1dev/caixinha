import axios from 'axios'

const api = axios.create({
    baseURL: "https://nodejs-backend-generic.herokuapp.com/"
})

export default api
