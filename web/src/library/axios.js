import axios from 'axios'

const axiosInstance = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
	baseURL: 'https://api.zodaland.com'
})

axiosInstance.defaults.withCredentials = true


export default axiosInstance