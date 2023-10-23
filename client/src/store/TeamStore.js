import { makeAutoObservable } from 'mobx'

export default class TeamStore {
	constructor() {
		this._players = [
			{
				id: 1,
				"name": "Robin",
				"surname": "Kool",
				"nickname": "ropz",
				"role": "Rifler (lurker)",
				"global_rating": 1.13,
				"role_rating": 1.15,
				"esports_player_points": 1400,
				"date_of_birth": "1999-12-22"
			}
		]
		this._teams = [
			{}
		]
	}
}