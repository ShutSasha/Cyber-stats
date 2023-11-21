import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import TeamModal from "../components/TeamModal";
import EditTeamModal from "../components/EditTeamModal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Team() {
	const [teams, setTeams] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingTeam, setEditingTeam] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState(null);
	const [reloadCount, setReloadCount] = useState(0);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const filteredTeams = teams.filter((team) =>
		team.team_name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedTeams = React.useMemo(() => {
		let sortableTeams = [...filteredTeams];
		if (sortConfig !== null) {
			sortableTeams.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableTeams;
	}, [filteredTeams, sortConfig]);

	const requestSort = (key) => {
		let direction = "ascending";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "ascending"
		) {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	const generatePDF = (teams) => {
		const currentDate = new Date();
		const day = currentDate.getDate();
		const month = currentDate.getMonth() + 1;
		const year = currentDate.getFullYear();
		const formattedDate = `Current date in dd/mm/yyyy: ${day}/${month}/${year}`;

		let filterTeams = teams
			.sort((a, b) => a.global_rating - b.global_rating)
			.slice(0, 5);
		console.log(filterTeams);
		const teamData = filterTeams.map((team) => {
			return [
				team.team_name,
				team.global_rating,
				team.team_points,
				team.team_country,
				team.coach_team,
			];
		});

		let docDefinition = {
			content: [
				{ style: "header", text: "Топ-5 команди за глобальним рейтингом" },
				{
					columns: [
						{ width: "*", text: "" },
						{
							width: "auto",
							table: {
								headerRows: 1,
								body: [
									[
										"Team Name",
										"Global Rating",
										"Points",
										"Country",
										"Coach",
									],
									...teamData,
								],
							},
						},
						{ width: "*", text: "" },
					],
				},
				{
					style: "date",
					text: formattedDate,
				},
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10],
					alignment: "center",
				},
				date: {
					margin: [0, 10, 0, 0],
				},
			},
		};

		pdfMake.createPdf(docDefinition).open();
	};

	const calculateGlobalRating = useCallback((teamData, teams) => {
		if (teams.length === 0) {
			return 1;
		}

		const sortedTeams = [...teams].sort(
			(a, b) => b.team_points - a.team_points
		);

		let rank = sortedTeams.findIndex(
			(team) => Number(team.team_id) === Number(teamData.team_id)
		);

		return rank + 1;
	}, []);

	const updateTeamRating = useCallback(
		(teams) => {
			teams.forEach((team) => {
				const newGlobalRating = calculateGlobalRating(team, teams);
				if (Number(newGlobalRating) !== Number(team.global_rating)) {
					team.global_rating = newGlobalRating;
					console.log(team);
					axios
						.put(
							`http://localhost:5000/api/team/teamEdit/${team.team_id}`,
							team
						)
						.catch((err) => {
							console.error(err);
						});
				}
			});
		},
		[calculateGlobalRating]
	);

	useEffect(() => {
		updateTeamRating(teams);
	}, [teams, updateTeamRating]);

	const deleteTeam = (id) => {
		axios
			.get(`http://localhost:5000/api/match`)
			.then((response) => {
				let isExist = false;
				response.data.forEach((element) => {
					if (element.team1_id === id || element.team2_id === id) {
						isExist = true;
					}
				});
				if (isExist) {
					toast.error("Cannot delete team with associated matches");
				} else {
					axios
						.delete(`http://localhost:5000/api/team/teamDel/${id}`)
						.then((response) => {
							const newTeam = teams.filter(
								(team) => Number(team.team_id) !== Number(id)
							);
							setTeams(teams.filter((team) => team.team_id !== id));
							updateTeamRating(newTeam);
						})
						.catch((error) => {
							console.error(`Error: ${error}`);
							toast.error(
								"Не можна видалити команду, яка повязана з іншими таблицями"
							);
						});
				}
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
				toast.error("Error fetching matches for team");
			});
	};

	const createTeam = (teamData) => {
		console.log(teamData);
		axios
			.post("http://localhost:5000/api/team", teamData)
			.then((response) => {
				console.log(response.data);
				const newTeam = response.data;
				const newTeams = [...teams, newTeam];
				setTeams(newTeams);
				const global_rating = calculateGlobalRating(newTeam, newTeams);
				newTeam.global_rating = global_rating;
				axios
					.put(
						`http://localhost:5000/api/team/teamEdit/${newTeam.team_id}`,
						newTeam
					)
					.then((response) => {
						updateTeamRating(newTeams);
						closeModal();
					})
					.catch((err) => console.error(err));
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		updateTeamRating(teams);
		closeEditModal();
	}, [teams, updateTeamRating]);

	const updateTeam = (teamData) => {
		axios
			.put(
				`http://localhost:5000/api/team/teamEdit/${editingTeam.team_id}`,
				teamData
			)
			.then((response) => {
				axios
					.get("http://localhost:5000/api/team")
					.then((res) => {
						const newTeams = res.data.rows.map((team) =>
							Number(team.team_id) === Number(editingTeam.team_id)
								? { ...team, ...teamData }
								: team
						);
						setTeams(newTeams);
					})
					.catch((err) => console.error(err));
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/team")
			.then((response) => {
				const teamPromises = response.data.rows.map((team) => {
					return axios
						.head(`http://localhost:5000/${team.img}`)
						.then(() => {
							return { ...team, imgExists: true };
						})
						.catch((err) => {
							console.info(`${err} + we can't find img`);
							axios.put(
								`http://localhost:5000/api/team/teamErrorImg/${team.team_id}`
							);
							if (reloadCount < 5) {
								setReloadCount(reloadCount + 1);
								window.location.reload();
							}
							return { ...team, imgExists: false };
						});
				});

				Promise.all(teamPromises).then((teams) => {
					setTeams(teams);
				});
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, [reloadCount]);

	return (
		<div>
			<input
				type="text"
				placeholder="Search by team name"
				value={searchTerm}
				onChange={handleSearchChange}
			/>
			<div>
				<h5>Згенеруй звіт</h5>
				<Button onClick={() => generatePDF(teams)}>Generate Report</Button>
			</div>
			<h1>Teams</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Image</th>
						<th>Team Name</th>
						<th>Country</th>
						<th>Date of Creation</th>
						<th>Coach</th>
						<th onClick={() => requestSort("global_rating")}>
							Global Rating
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "global_rating" &&
										sortConfig.direction === "ascending"
											? 1
											: 0.3,
								}}
							>
								🔼
							</span>
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "global_rating" &&
										sortConfig.direction === "descending"
											? 1
											: 0.3,
								}}
							>
								🔽
							</span>
						</th>
						<th onClick={() => requestSort("team_points")}>
							Points
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "team_points" &&
										sortConfig.direction === "ascending"
											? 1
											: 0.3,
								}}
							>
								🔼
							</span>
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "team_points" &&
										sortConfig.direction === "descending"
											? 1
											: 0.3,
								}}
							>
								🔽
							</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{sortedTeams.map((team) => (
						<tr key={team.team_id}>
							<td>
								{team.img && (
									<img
										src={`http://localhost:5000/${team.img}`}
										alt={team.team_name}
										style={{ width: "70px", height: "70px" }}
									/>
								)}
							</td>
							<td>{team.team_name}</td>
							<td>{team.team_country}</td>
							<td>{team.date_of_creating_team}</td>
							<td>{team.coach_team}</td>
							<td>{team.global_rating}</td>
							<td>{team.team_points}</td>
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
										onClick={() => deleteTeam(team.team_id)}
									>
										Delete
									</Button>
									<Button
										variant="primary"
										onClick={() => {
											setEditingTeam(team);
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

			<Button onClick={openModal}>Create Team</Button>

			<TeamModal
				show={showModal}
				onClose={closeModal}
				setTeams={setTeams}
				teams={teams}
				onCreate={createTeam}
			/>

			<EditTeamModal
				show={showEditModal}
				onClose={closeEditModal}
				onUpdate={updateTeam}
				editingTeam={editingTeam}
			/>
		</div>
	);
}

export default Team;
