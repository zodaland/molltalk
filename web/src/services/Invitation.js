import axios from '../library/axios'

export function create(params) {
	return axios.post('/invitation', params)
	.then((response) => {
		return response
	})
}

export function getMyInvitation(params) {
	return axios.get(`/invitation/`)
	.then((response) => {
		return response;
	})
};