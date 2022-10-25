import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import './styles/App.scss';
import AuthPage from './pages/AuthPage';
import LobbyPage from './pages/LobbyPage';
import RoomPage from './pages/RoomPage';
import type { RootState } from './store'
import { chatActions } from './redux/chat.slice';


function App() {
	const dispatch = useDispatch()
	useEffect(() => {
		window.addEventListener('beforeunload', () => {
			dispatch(chatActions.exitUser())
		});
	}, [])
	useEffect(() => {
		window.addEventListener('storage', () => {
			dispatch(chatActions.updateStateFromLS())
		})
	}, [])

	const auth = useSelector((state: RootState) => state.chat.auth)
	if (auth) {
		return (
			<div className='app'>
				<Routes>
					<Route path='/lobby' element={<LobbyPage />} />
					<Route path='/room/:name' element={<RoomPage />} />
					<Route path="*" element={<Navigate to="/lobby" />} />
				</Routes>
			</div>
		)
	} else {
		return (
			<div className='app'>
				<Routes>
					<Route path='/auth' element={<AuthPage />} />
					<Route path="*" element={<Navigate to="/auth" />} />
				</Routes>
			</div>
		)
	}

}

export default App;
