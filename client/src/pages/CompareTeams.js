import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Select from "react-select";

function CompareTeams() {
	const [selectedTeam1, setSelectedTeam1] = useState("");
	const [selectedTeam2, setSelectedTeam2] = useState("");
	const [winPercentage, setWinPercentage] = useState(null);
	const [teams, setTeams] = useState([]);

	const teamOptions = teams.map((team) => ({
		value: team.team_id,
		label: team.team_name,
	}));

	const calculateWinPercentage = () => {
		// Calculate win percentage based on selected teams and players
		// This is a placeholder and should be replaced with your own calculation
		const percentage = Math.random() * 100;
		setWinPercentage(percentage.toFixed(2));
	};

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
		console.log(selectedTeam1);
		console.log(selectedTeam2);
	}, [selectedTeam1, selectedTeam2]);

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
			<h1>Compare Teams</h1>
			<label>
				Team 1:
				<Select
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
								<>
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
								</>
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
								<>
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
								</>
							))}
					</tbody>
				</Table>
			</div>
			{/* Render your player selection components here */}
			{/* <button onClick={calculateWinPercentage}>Compare</button> */}
			<Button variant="primary" onClick={calculateWinPercentage}>
				Compare
			</Button>
			{winPercentage && <p>Win Percentage: {winPercentage}%</p>}
		</div>
	);
}

export default CompareTeams;
