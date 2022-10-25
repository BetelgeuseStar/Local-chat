import { IUser } from '../models/models'

interface UsersOnlineProps {
	users: IUser[]
}

function UsersOnline({ users }: UsersOnlineProps) {
	return (
		<div className='users'>
			<div className='users__online'>
				<h3 className='users__title'>Пользователи онлайн</h3>
				<ul className='users__online-list'>
					{users.map((user: IUser) => {
						if (user.online) {
							return (
								<li key={user.name} className='users__user_online'>{user.name}</li>
							)
						}
					})}
				</ul>
			</div>
			<div className='users__offline'>
				<h3 className='users__title'>Пользователи оффлайн</h3>
				<ul className='users__offline-list'>
					{users.map((user: IUser) => {
						if (!user.online) {
							return (
								<li key={user.name} className='users__user_offline'>{user.name}</li>
							)
						}
					})}
				</ul>
			</div>
		</div>
	)
}

export default UsersOnline