import React, { Component } from 'react'
import * as Room from '../services/Room'
import * as RoomUser from '../services/RoomUser'
import * as Invitation from '../services/Invitation'

class UserFound extends Component {
	static defaultProps = {
		id: ''
	}

	state = {
		isFocus: false
	}

	//유저를 클릭하여 초대버튼 활성화
	handleClick = () => {
		const toggledFocus = !this.state.isFocus
		this.setState({
			isFocus: toggledFocus
		})
	}
	//유저 초대
	inviteUser = async () => {
		try {
		let params = {}
		const fetchRoomData = await Room.create()

		if (fetchRoomData.data.code !== '0000') {
			alert('방 생성중 오류발생')
			return
		}
		params.roomNo = fetchRoomData.data.data

		const fetchRoomUserData = await RoomUser.create(params)

		if (fetchRoomUserData.data.code !== '0000') {
			alert('방 유저 추가중 오류 발생')
			return
		}

		params.invitedUserId = this.props.id

		const fetchInvitationData = await Invitation.create(params)

		} catch(error) {
			console.log(error)
			alert('실패')
		}
	}
	//props나 state값이 바뀌어야 컴포넌트 변경되도록 처리
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.id !== nextProps.id || this.state.isFocus !== nextState.isFocus) {
			return true
		}

		return true
	}

	test() {
	}

	render() {
		if (!this.state.isFocus) {
			return(
				<div>
					<span onClick={test}>test</span>
					<span
						onClick={this.handleClick}
					>
						{this.props.id}
					</span>
				</div>
			)
		} else {
			return( 
				<div>
					<span onClick={this.handleClick}>{this.props.id}</span>
					<div>
						<span onClick={this.inviteUser}>초대</span>
					</div>
				</div>
			)
		}
	}
}

export default UserFound