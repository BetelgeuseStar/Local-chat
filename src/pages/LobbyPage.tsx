import { useState } from 'react'
import Button from '../components/Button'
import { IRoom } from '../models/models'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { chatActions } from '../redux/chat.slice'
import UsersOnline from '../components/UsersOnline'
import { useNavigate } from 'react-router-dom'


function LobbyPage() {
	const [modalClass, setModalClass] = useState('')
	const [targetRoom, setTargetRoom] = useState('')
	const [roomName, setRoomName] = useState('')
	const [roomDescr, setRoomDescr] = useState('')
	const [error, setError] = useState('')
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const state = useSelector((state: RootState) => state.chat)
	const currentUser = JSON.parse(sessionStorage.getItem('currentUser') ?? '')

	function createRoomHandler() {
		if (!roomName) {
			setError('Введите название комнаты')
			return
		}
		const room = state.rooms.find(room => room.name === roomName)
		if (room) {
			setError('Такая комната уже существует')
			return
		}
		dispatch(chatActions.createRoom({ name: roomName, descr: roomDescr, messages: [], usersInRoom: [] }))
		setModalClass('')
		setError('')
		setRoomName('')
		setRoomDescr('')
	}

	function enterRoomHandler() {
		dispatch(chatActions.enterRoom(targetRoom))
		navigate(targetRoom ? ('/room/' + targetRoom) : '/lobby')
	}

	return (
		<div className='lobby'>
			<div className='lobby-window'>
				<div className='lobby-window__interface interface'>
					<div className='interface__user-info'>
						<div className='interface__user'>Пользователь: <span className='interface__username'>{currentUser.name}</span></div>
						<Button onClick={() => dispatch(chatActions.exitUser())} className='interface__exit-btn'>Выйти из профиля</Button>
					</div>
					<div className='interface__buttons'>
						<Button onClick={() => enterRoomHandler()} className={'interface__btn'}>Войти в комнату</Button>
						<Button onClick={() => setModalClass(' active')} className='interface__btn'>Создать комнату</Button>
					</div>
				</div>
				<div className='lobby-window__rooms lobby-rooms'>
					<ul className='lobby-rooms__list'>
						{state.rooms.map((room: IRoom) => {
							let modifier = room.name === targetRoom ? ' active' : ''
							return (
								<li onDoubleClick={() => enterRoomHandler()} key={room.name} className={'lobby-rooms__room' + modifier} onClick={() => setTargetRoom(room.name)}>
									<h3 className='lobby-rooms__room-name'>{room.name}</h3>
									<span className='lobby-rooms__room-descr'>{room.descr}</span>
									<span className='lobby-rooms__room-users-count'>{room.usersInRoom.length} чел.</span>
								</li>
							)
						})}
					</ul>
				</div>
				<UsersOnline users={state.users} />
			</div>
			<div className={'modal' + modalClass} onClick={() => { setModalClass(''); setError('') }}>
				<div className='modal__window ' onClick={e => e.stopPropagation()}>
					<h2 className='modal__title'>Создание комнаты</h2>
					<label className='window__label modal__label' htmlFor="roomname">Название комнаты </label>
					<input onChange={(e) => setRoomName(e.target.value)} value={roomName} className='window__input modal__input' type="text" name="roomname" id='roomname' />
					<label className='window__label modal__label' htmlFor="roomdescr">Описание комнаты </label>
					<textarea onChange={(e) => setRoomDescr(e.target.value)} value={roomDescr} className='modal__textarea' name="roomdescr" id='roomdescr' />
					<Button className='modal__btn' onClick={() => createRoomHandler()}>Создать</Button>
					<div className={'auth-window__error error' + (error ? ' active' : '')}>{error}</div>
				</div>
			</div>
		</div>
	)
}

export default LobbyPage