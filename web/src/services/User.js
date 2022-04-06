import axios from '../library/axios'

export function regist(params) {
	return axios.post('/auth/register', params)
	.then((response) => {
		return response
	})
}

export function login(params) {
	return axios.post('/auth/login', params)
	.then((response) => {
		return response
	})
}

export function check(token) {
	if (token) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	}

	return axios.get('/user/check')
	.then((response) => {
		return response
	})
}

export function logout() {
	return axios.get('/auth/logout')
	.then((response) => {
		return response
	})
}

export function findById(params) {
	return axios.get(`/user/${params}`)
	.then((response) => {
		return response
	})
}