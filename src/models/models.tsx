export interface IRoom {
	name: string
	descr: string
	usersInRoom: IUser[]
	messages: IMessage[]
}

export interface IUser {
	name: string
	password: string
	online: boolean
}

export interface IMessage {
	from: string
	body: string
	room: string
}