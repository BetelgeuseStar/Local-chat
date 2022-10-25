import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser, IRoom, IMessage } from "../models/models"


interface chatState {
	users: IUser[]
	rooms: IRoom[]
	auth: boolean
}

const initialState: chatState = {
	users: JSON.parse(localStorage.getItem('users') ?? '[]'),
	rooms: JSON.parse(localStorage.getItem('rooms') ?? '[]'),
	auth: sessionStorage.getItem('currentUser') ? true : false
}

export const chatSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		authUser(state: chatState, action: PayloadAction<IUser>) {
			const user = state.users.find(user => user.name === action.payload.name)
			if (user) {
				state.users.map(user => {
					if (user.name === action.payload.name) {
						user.online = true
					}
					return user
				})
			} else {
				state.users.push({ ...action.payload, online: true })
			}
			state.auth = true
			sessionStorage.setItem('currentUser', JSON.stringify({ ...action.payload, online: true }))
			localStorage.setItem('users', JSON.stringify(state.users))
		},
		exitUser(state: chatState) {
			const currentUser = JSON.parse(sessionStorage.getItem('currentUser') ?? '')
			const currentRoom = sessionStorage.getItem('currentRoom')
			if (currentRoom) {
				state.rooms = state.rooms.map(room => {
					if (room.name === currentRoom) {
						room.usersInRoom = room.usersInRoom.filter(user => {
							return user.name !== currentUser.name
						})
					}
					return room
				})
			}
			state.users = state.users.map(user => {
				if (currentUser.name === user.name) {
					user.online = false
				}
				return user
			})
			localStorage.setItem('users', JSON.stringify(state.users))
			localStorage.setItem('rooms', JSON.stringify(state.rooms))
			state.auth = false
		},
		createRoom(state: chatState, action: PayloadAction<IRoom>) {
			const room = state.rooms.find(room => room.name === action.payload.name)
			if (room) {
				throw (new Error('Комната с таким именем уже существует'))
			} else {
				state.rooms.push(action.payload)
				localStorage.setItem('rooms', JSON.stringify(state.rooms))
			}
		},
		enterRoom(state: chatState, action: PayloadAction<string>) {
			const currentUser = JSON.parse(sessionStorage.getItem('currentUser') ?? '')
			state.rooms = state.rooms.map(room => {
				if (room.name === action.payload) {
					room.usersInRoom.push(currentUser)
				}
				return room
			})
			sessionStorage.setItem('currentRoom', action.payload)
			localStorage.setItem('rooms', JSON.stringify(state.rooms))
		},
		exitRoom(state: chatState, action: PayloadAction<string>) {
			const currentUser = JSON.parse(sessionStorage.getItem('currentUser') ?? '')
			state.rooms = state.rooms.map(room => {
				if (room.name === action.payload) {
					room.usersInRoom = room.usersInRoom.filter(user => {
						return user.name !== currentUser.name
					})
				}
				return room
			})
			sessionStorage.setItem('currentRoom', '')
			localStorage.setItem('rooms', JSON.stringify(state.rooms))
		},
		sendMessage(state: chatState, action: PayloadAction<IMessage>) {
			state.rooms = state.rooms.map(room => {
				if (room.name === action.payload.room) {
					room.messages.push(action.payload)
				}
				return room
			})
			localStorage.setItem('rooms', JSON.stringify(state.rooms))
		},
		updateStateFromLS(state: chatState) {
			const users = JSON.parse(localStorage.getItem('users') ?? '[]')
			const rooms = JSON.parse(localStorage.getItem('rooms') ?? '[]')
			state.rooms = rooms
			state.users = users
		}
	}
})

export const chatActions = chatSlice.actions

export default chatSlice.reducer
