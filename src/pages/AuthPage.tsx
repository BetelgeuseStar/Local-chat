import { useState, KeyboardEvent } from 'react'
import Button from '../components/Button'
import { useSelector, useDispatch } from 'react-redux'
import { chatActions } from '../redux/chat.slice'
import type { RootState } from '../store'

export default function AuthPage() {
	const [userName, setUserName] = useState('')
	const [userPass, setUserPass] = useState('')
	const [error, setError] = useState('')
	const dispatch = useDispatch()
	const users = useSelector((state: RootState) => state.chat.users)

	function pressKeyHandler(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') authHandler()
	}

	function authHandler() {
		if (!userName) {
			setError('Введите имя пользователя')
			return
		}
		const user = users.find(user => user.name === userName)
		if (user?.online) {
			setError('Этот пользователь уже онлайн')
			return
		}
		if (user && user.password !== userPass) {
			setError('Неверный пароль')
			return
		}
		dispatch(chatActions.authUser({ name: userName, password: userPass, online: false }))
		setError('')
	}

	return (
		<div className='auth'>
			<div className='auth-window'>
				<h2 className='auth-window__title'>Добро пожаловать в чат!</h2>
				<form className='auth-window__form'>
					<div className='auth-window__inputs'>
						<label className='auth-window__label window__label' htmlFor="username">Имя пользователя </label>
						<input onKeyDown={(e) => pressKeyHandler(e)} onChange={(e) => setUserName(e.target.value)} value={userName}
							className='auth-window__input window__input' type="text" name="username" id='username' />
						<label className='auth-window__label window__label' htmlFor="userpass">Пароль </label>
						<input onKeyDown={(e) => pressKeyHandler(e)} onChange={(e) => setUserPass(e.target.value)} value={userPass}
							className='auth-window__input window__input' type="text" name="userpass" id='userpass' />
					</div>
					<Button onClick={() => { authHandler() }} className='auth-window__btn'>Войти</Button>
					<div className={'auth-window__error error' + (error ? ' active' : '')}>{error}</div>
				</form>
			</div>
		</div>
	)
}
