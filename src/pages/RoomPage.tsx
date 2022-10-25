import { useState, KeyboardEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { IUser, IMessage } from '../models/models'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { chatActions } from '../redux/chat.slice'
import UsersOnline from '../components/UsersOnline'



function RoomPage() {
	const params = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const state = useSelector((state: RootState) => state.chat)
	const currentUser = JSON.parse(sessionStorage.getItem('currentUser') ?? '')
	const currentRoom = state.rooms.find(room => room.name === params.name)
	const [smileListOpened, setSmileListOpened] = useState(false)
	const [messageValue, setMessageValue] = useState('')
	const [citationBody, setCitationBody] = useState(sessionStorage.getItem('citation'))
	const [citation, setCitation] = useState({ from: 0, to: 0 })
	const emojiArr = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈',
		'😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑',
		'😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚',
		'😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣',
		'😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬',
		'😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵',
		'😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿',
		'🙀', '💩', '☠', '👌', '👍', '👎', '🙈', '🙉', '🙊']

	function exitRoomHandler() {
		dispatch(chatActions.exitRoom(currentRoom?.name ?? ''))
		navigate('/lobby')
	}

	function pressKeyHandler(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') sendMessageHandler()
	}

	function sendMessageHandler() {
		if (messageValue) {
			dispatch(chatActions.sendMessage({ from: currentUser.name, body: messageValue, room: currentRoom?.name ?? '' }))
			setMessageValue('')
		}
	}

	function addSmileHandler(smile: string) {
		setMessageValue(prev => prev + smile)
		setSmileListOpened(prev => !prev)
	}

	function messageClickHandler(index: number) {
		if (citation.from === citation.to && citation.from === index) {
			setCitation({ from: 0, to: 0 })
		} else if (citation.from === 0 && citation.to === 0 && index !== 0) {
			setCitation({ from: index, to: index })
		} else if (index > citation.to) {
			setCitation(prev => {
				return { ...prev, to: index }
			})
		} else if (index < citation.from) {
			setCitation(prev => {
				return { ...prev, from: index }
			})
		} else if (index < citation.to && index >= citation.from) {
			setCitation(prev => {
				return { ...prev, to: index }
			})
		} else if (index > citation.from && index <= citation.to) {
			setCitation(prev => {
				return { ...prev, from: index }
			})
		} else if (index < citation.to && index < citation.from) {
			setCitation(prev => {
				return { from: index, to: prev.from }
			})
		} else if (index > citation.from && index > citation.to) {
			setCitation(prev => {
				return { from: prev.to, to: index }
			})
		}
	}

	function citationBtnHandler() {
		if (citationBody) {
			dispatch(chatActions.sendMessage({ from: currentUser.name, body: citationBody, room: currentRoom?.name ?? '' }))
			setCitationBody('')
			setCitation({ from: 0, to: 0 })
			sessionStorage.setItem('citation', '')
		} else if (citation.from !== 0 && citation.to !== 0) {
			const messagesArray = currentRoom?.messages.slice(citation.from - 1, citation.to)
			let messagesBody: string[] = []
			messagesArray?.forEach((item) => {
				messagesBody.push(`${item.from}: ${item.body}`)
			})
			setCitationBody(messagesBody.join("\n\n"))
			sessionStorage.setItem('citation', messagesBody.join("\n\n"))
		}
	}


	return (
		<div className='room'>
			<div className='room-window'>
				<div className="room-window__interface interface room-interface">
					<div className='room-interface__user-info interface__user-info'>
						<div className='room-interface__user interface__user'>Пользователь: <span className='interface__username'>{currentUser.name}</span></div>
						<Button onClick={() => dispatch(chatActions.exitUser())} className='interface__exit-btn'>Выйти из профиля</Button>
					</div>
					<div className='room-interface__room-info'>
						<div className='room-interface__info'>
							<p className='room-interface__title'>Название комнаты:</p>
							<p className="room-interface__name">{currentRoom?.name ?? ''}</p>
							<p className='room-interface__title'>Описание комнаты:</p>
							<p className="room-interface__descr">{currentRoom?.descr ?? ''}</p>
						</div>
						<div className='users-in-room'>
							<h3 className='users-in-room__title'>Пользователи в комнате</h3>
							<ul className='users-in-room__list'>
								{currentRoom?.usersInRoom.map((user: IUser) => {
									return (
										<li key={user.name} className='users__user_online'>{user.name}</li>
									)
								})}
							</ul>
						</div>
					</div>
					<div className='room-interface__buttons interface__buttons'>
						<Button onClick={() => exitRoomHandler()} className='room-interface__btn interface__btn'>Покинуть комнату</Button>
					</div>
				</div>
				<div className="room-window__chat chat">
					<div className="chat__body">
						<ul className="chat__message-list">
							{currentRoom?.messages.map((message: IMessage, index: number) => {
								const myOwn = message.from === currentUser.name
								const key = message.body + ' messageKey: ' + index
								const selected = (index >= citation.from - 1) && (index <= citation.to - 1) ? true : false
								return (
									<li onClick={(e) => messageClickHandler(index + 1)} key={key} className={'chat__message' + (myOwn ? ' myOwn' : '') + (selected ? ' selected' : '')}>
										<p className={'chat__message-body' + (myOwn ? ' myOwn' : '')}><span className="chat__message-from">{message.from}: </span>{message.body}</p>
									</li>
								)
							})}
						</ul>
					</div>
					<div className="chat__interface">
						<Icon onClick={() => citationBtnHandler()} className={'chat__citation-btn' + (citationBody ? ' active' : '')} type='citation' />
						<Icon onClick={() => setSmileListOpened(prev => !prev)} className='chat__emoji-btn' type='smiley-face' />
						<input onKeyDown={(e) => pressKeyHandler(e)} onChange={(e) => setMessageValue(e.target.value)} value={messageValue} className='chat__input' type="text" />
						<Button onClick={() => sendMessageHandler()} className='chat__send-btn'>Отправить</Button>
						<ul className={'chat__emoji-list' + (smileListOpened ? ' active' : '')}>
							{emojiArr.map(item => {
								return (
									<li key={item} onClick={() => addSmileHandler(item)} className='chat__emoji-item'>{item}</li>
								)
							})}

						</ul>
					</div>
				</div>
				<UsersOnline users={state.users} />
			</div>
		</div>
	)
}

export default RoomPage