import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import MatchModal from "../components/MatchModal";
import EditMatchModal from "../components/EditMatchModal";
import { toast } from "react-toastify";

function Match() {
	const [matches, setMatches] = useState([]);
	const [teams, setTeams] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingMatch, setEditingMatch] = useState(null);
	const [teamMatches, setTeamMatches] = useState({});

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);
	const [tournaments, setTournaments] = useState({});

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/tournament")
			.then((response) => {
				const tournamentsById = response.data.reduce((acc, tournament) => {
					acc[tournament.tournament_id] = tournament;
					return acc;
				}, {});
				setTournaments(tournamentsById);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	const createMatch = (matchData) => {
		axios
			.post("http://localhost:5000/api/match", matchData)
			.then((response) => {
				axios
					.post("http://localhost:5000/api/matchTeam", response.data)
					.then((res) => {
						console.log(`success`);
					})
					.catch((err) => {
						console.error(err);
					});
				console.log(response.data);
				setMatches([...matches, response.data]);
				closeModal();
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
				toast.error("Не всі поля заповнені");
			});
	};

	const deleteMatch = (id) => {
		axios
			.delete(`http://localhost:5000/api/match/${id}`)
			.then((response) => {
				console.log(response.data);
				setMatches(matches.filter((match) => match.match_id !== id));
				axios
					.get(`http://localhost:5000/api/matchTeam`)
					.then((response) => {
						const matchTeams = response.data;
						const relatedMatchTeams = matchTeams.filter(
							(matchTeam) => matchTeam.matchMatchId === id
						);

						relatedMatchTeams.forEach((matchTeam) => {
							axios
								.delete(
									`http://localhost:5000/api/matchTeam/${matchTeam.match_team_id}`
								)
								.then((response) => {
									console.log(response.data);
								})
								.catch((error) => {
									console.error(`Error: ${error}`);
								});
						});
					})
					.catch((error) => {
						console.error(`Error: ${error}`);
					});
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	const updateMatch = (id, updatedMatchData) => {
		axios
			.put(`http://localhost:5000/api/match/${id}`, updatedMatchData)
			.then((response) => {
				let result = teamMatches.filter((teamMatch) =>
					matches.some((match) => id === teamMatch.matchMatchId)
				);
				console.log(result);
				axios
					.put(
						`http://localhost:5000/api/matchTeam/${result[0].match_team_id}`,
						updatedMatchData
					)
					.then((res) => {
						console.log(`success update match-team table`);
					})
					.catch((err) => {
						console.log("put err");
					});

				setMatches(
					matches.map((match) =>
						match.match_id === id
							? { ...match, ...updatedMatchData }
							: match
					)
				);
				closeEditModal();
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/matchTeam")
			.then((res) => {
				setTeamMatches(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/team")
			.then((response) => {
				const teamsById = response.data.rows.reduce((acc, team) => {
					acc[team.team_id] = team;
					return acc;
				}, {});
				setTeams(teamsById);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/match")
			.then((response) => {
				setMatches(response.data);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	return (
		<div>
			<h1>Matches</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Match Date</th>
						<th>Tournament</th>
						<th>Result</th>
						<th>Match Points</th>
						<th>Team 1</th>
						<th>Team 2</th>
						<th>Team 1 Image</th>
						<th>Team 2 Image</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{matches &&
						teams &&
						matches.map((match) => (
							<tr key={match.match_id}>
								<td>{match.match_date}</td>
								<td>
									{
										tournaments[match.tournamentTournamentId]
											?.tournament_name
									}
								</td>
								<td>{match.result ? "Team 1 Wins" : "Team 2 Wins"}</td>
								<td>{match.match_points}</td>
								<td>{teams[match.team1_id]?.team_name}</td>
								<td>{teams[match.team2_id]?.team_name}</td>
								<td>
									{teams[match.team1_id]?.img && (
										<img
											src={`http://localhost:5000/${
												teams[match.team1_id]?.img
											}`}
											alt="Team 1"
											style={{ width: "70px", height: "70px" }}
										/>
									)}
								</td>
								<td>
									{teams[match.team2_id]?.img && (
										<img
											src={`http://localhost:5000/${
												teams[match.team2_id]?.img
											}`}
											alt="Team 2"
											style={{ width: "70px", height: "70px" }}
										/>
									)}
								</td>
								<td>
									<div
										style={{
											display: "flex",
											justifyContent: "space-around",
											alignItems: "center",
										}}
									>
										<Button
											variant="danger"
											onClick={() => deleteMatch(match.match_id)}
										>
											Delete
										</Button>
										<Button
											variant="primary"
											onClick={() => {
												setEditingMatch(match);
												openEditModal();
											}}
										>
											Edit
										</Button>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</Table>
			<Button onClick={openModal}>Create Match</Button>

			<MatchModal
				show={showModal}
				onClose={closeModal}
				onCreate={createMatch}
			/>

			<EditMatchModal
				show={showEditModal}
				onClose={closeEditModal}
				onUpdate={(updatedMatchData) =>
					updateMatch(editingMatch.match_id, updatedMatchData)
				}
				editingMatch={editingMatch}
				match={editingMatch}
			/>
		</div>
	);
}

export default Match;
