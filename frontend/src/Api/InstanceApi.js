import axios from 'axios'

const Api = axios.create({
    baseURL:"http://localhost:5010/api"
})

export default Api 