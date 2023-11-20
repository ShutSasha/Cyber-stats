import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { toast } from "react-toastify";
import Alert from "react-bootstrap/Alert";

function CompareTeams() {
	const [selectedTeam1, setSelectedTeam1] = useState("");
	const [selectedTeam2, setSelectedTeam2] = useState("");
	const [winPercentage, setWinPercentage] = useState([]);
	const [teams, setTeams] = useState([]);
	const [players, setPlayers] = useState([]);
	const [isClear, setIsClear] = useState(false);

	const handleClear = () => {
		setIsClear(true);
	};

	const teamOptions = teams.map((team) => ({
		value: team.team_id,
		label: team.team_name,
	}));

	const calculateWinPercentage = () => {
		if (!selectedTeam1 || !selectedTeam2) {
			toast.error("Оберіть дві команди");
			return;
		}
		const playersTeam1 = players.filter(
			(player) => Number(player.teamTeamId) === Number(selectedTeam1)
		);
		const playersTeam2 = players.filter(
			(player) => Number(player.teamTeamId) === Number(selectedTeam2)
		);
		if (
			Number(playersTeam1.length) !== 5 ||
			Number(playersTeam2.length) !== 5
		) {
			toast.error(
				`У одній з команд не 5 гравців. Для порівняння команд в команді повинно бути 5 гравців, адже повна команда складається з 5.`
			);
			return;
		}

		if (Number(selectedTeam1) === Number(selectedTeam2)) {
			toast.error(`Одну й ту саму команду не можна порівнювати`);
			return;
		}
		const totalPointsTeam1 = playersTeam1.reduce(
			(total, player) => total + player.esports_player_points,
			0
		);
		const totalPointsTeam2 = playersTeam2.reduce(
			(total, player) => total + player.esports_player_points,
			0
		);

		const winPercentageTeam1 =
			(totalPointsTeam1 / (totalPointsTeam1 + totalPointsTeam2)) * 100;
		const winPercentageTeam2 =
			(totalPointsTeam2 / (totalPointsTeam1 + totalPointsTeam2)) * 100;

		setIsClear(false);

		setWinPercentage([
			winPercentageTeam1.toFixed(2),
			winPercentageTeam2.toFixed(2),
		]);
	};

	useEffect(() => {
		console.log(winPercentage);
	}, [winPercentage]);
	// useEffect(() => {
	// 	axios
	// 		.get("http://localhost:5000/api/team/23")
	// 		.then((res) => console.log(res.data))
	// 		.catch((err) => console.error(err));
	// }, []);

	// useEffect(() => {
	// 	axios
	// 		.get("http://localhost:5000/api/tournament/8")
	// 		.then((res) => console.log(res.data))
	// 		.catch((err) => console.error(err));
	// }, []);
	useEffect(() => {
		axios
			.get("http://localhost:5000/api/player")
			.then((res) => setPlayers(res.data))
			.catch((err) => console.error(err));
	}, []);

	// useEffect(() => {
	// 	console.log(selectedTeam1);
	// 	console.log(selectedTeam2);
	// }, [selectedTeam1, selectedTeam2]);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/team")
			.then((res) => {
				setTeams(res.data.rows);
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<div>
			{winPercentage.length === 2 && !isClear && (
				<>
					<Alert
						variant={
							winPercentage[0] > winPercentage[1] ? "success" : "danger"
						}
					>
						Win Percentage for Team1: {winPercentage[0]}%
					</Alert>
					<Alert
						variant={
							winPercentage[1] > winPercentage[0] ? "success" : "danger"
						}
					>
						Win Percentage for Team2: {winPercentage[1]}%
					</Alert>
				</>
			)}
			<h1>Compare Teams</h1>
			<h5>Choose teams for compare below</h5>
			<label>
				Team 1:
				<Select
					styles={{
						control: (base) => ({
							...base,
							minWidth: "200px",
							marginRight: "50px",
						}),
					}}
					value={teamOptions.find(
						(option) => option.value === selectedTeam1
					)}
					onChange={(option) =>
						setSelectedTeam1(option ? option.value : "")
					}
					options={teamOptions}
					isClearable
				/>
			</label>
			<label>
				Team 2:
				<Select
					styles={{ control: (base) => ({ ...base, minWidth: "200px" }) }}
					value={teamOptions.find(
						(option) => option.value === selectedTeam2
					)}
					onChange={(option) =>
						setSelectedTeam2(option ? option.value : "")
					}
					options={teamOptions}
					isClearable
				/>
			</label>
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: "50px",
					marginBottom: "50px",
				}}
			>
				<Table
					striped
					bordered
					hover
					style={{ marginRight: "100px", tableLayout: "fixed" }}
				>
					<tbody>
						{teams
							.filter(
								(team) => Number(team.team_id) === Number(selectedTeam1)
							)
							.map((team) => (
								<React.Fragment key={team.team_id}>
									<tr>
										<th>Image</th>
										<td>
											{team.img && (
												<img
													src={`http://localhost:5000/${team.img}`}
													alt={team.team_name}
													style={{ width: "70px", height: "70px" }}
												/>
											)}
										</td>
									</tr>
									<tr>
										<th>Team Name</th>
										<td>{team.team_name}</td>
									</tr>
									<tr>
										<th>Country</th>
										<td>{team.team_country}</td>
									</tr>
									<tr>
										<th>Date of Creation</th>
										<td>{team.date_of_creating_team}</td>
									</tr>
									<tr>
										<th>Coach</th>
										<td>{team.coach_team}</td>
									</tr>
									<tr>
										<th>Global Rating</th>
										<td>{team.global_rating}</td>
									</tr>
									<tr>
										<th>Points</th>
										<td>{team.team_points}</td>
									</tr>
								</React.Fragment>
							))}
					</tbody>
				</Table>
				<Table striped bordered hover style={{ tableLayout: "fixed" }}>
					<tbody>
						{teams
							.filter(
								(team) => Number(team.team_id) === Number(selectedTeam2)
							)
							.map((team) => (
								<React.Fragment key={team.team_id}>
									<tr>
										<th>Image</th>
										<td>
											{team.img && (
												<img
													src={`http://localhost:5000/${team.img}`}
													alt={team.team_name}
													style={{ width: "70px", height: "70px" }}
												/>
											)}
										</td>
									</tr>
									<tr>
										<th>Team Name</th>
										<td>{team.team_name}</td>
									</tr>
									<tr>
										<th>Country</th>
										<td>{team.team_country}</td>
									</tr>
									<tr>
										<th>Date of Creation</th>
										<td>{team.date_of_creating_team}</td>
									</tr>
									<tr>
										<th>Coach</th>
										<td>{team.coach_team}</td>
									</tr>
									<tr>
										<th>Global Rating</th>
										<td>{team.global_rating}</td>
									</tr>
									<tr>
										<th>Points</th>
										<td>{team.team_points}</td>
									</tr>
								</React.Fragment>
							))}
					</tbody>
				</Table>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: "50px",
					marginBottom: "50px",
				}}
			>
				<Table
					striped
					bordered
					hover
					style={{ marginRight: "100px", tableLayout: "fixed" }}
				>
					<thead>
						<tr>
							<th>Player name</th>
							<th>Player surname</th>
							<th>Player nickname</th>
							<th>Global rating</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						{players
							.filter(
								(player) =>
									Number(player.teamTeamId) === Number(selectedTeam1)
							)
							.map((player) => (
								<tr key={player.esports_player_id}>
									<td>{player.name}</td>
									<th>{player.surname}</th>
									<th>{player.nickname}</th>
									<th>{player.global_rating}</th>
									<th>{player.esports_player_points}</th>
								</tr>
							))}
					</tbody>
				</Table>
				<Table striped bordered hover style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th>Player name</th>
							<th>Player surname</th>
							<th>Player nickname</th>
							<th>Global rating</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						{players
							.filter(
								(player) =>
									Number(player.teamTeamId) === Number(selectedTeam2)
							)
							.map((player) => (
								<tr key={player.esports_player_id}>
									<td>{player.name}</td>
									<th>{player.surname}</th>
									<th>{player.nickname}</th>
									<th>{player.global_rating}</th>
									<th>{player.esports_player_points}</th>
								</tr>
							))}
					</tbody>
				</Table>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: "20px",
				}}
			>
				<div>
					<Button
						style={{ marginRight: "20px" }}
						variant="outline-primary"
						onClick={calculateWinPercentage}
						className="btn-lg btn-block"
					>
						Compare
					</Button>
					<Button
						variant="outline-danger"
						onClick={handleClear}
						className="btn-lg btn-block"
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	);
}

export default CompareTeams;
