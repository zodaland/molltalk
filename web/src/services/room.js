import axios from '../library/axios'

export function create(param) {
	return axios.post('/room', param)
	.then((response) => {
		return response
	})
}

export function find() {
	return axios.get('/room')
	.then((response) => {
		return response
	})
}

export function deleteRoom(param) {
	return axios.delete(`/room/${param}`)
	.then((response) => {
		return response
	})
}