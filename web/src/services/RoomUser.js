import axios from '../library/axios'

export function create(params) {
	return axios.post('/room/user', params)
	.then((response) => {
		return response
	})
}
export function deleteRoomUser(param) {
	return axios.delete(`/room/${param}/user`)
	.then((response) => {
		return response
	})
}