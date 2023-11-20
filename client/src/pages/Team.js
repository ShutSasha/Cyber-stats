import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import TeamModal from "../components/TeamModal";
import EditTeamModal from "../components/EditTeamModal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

// var fontName = "Arial";
// var fontStyle = "normal";
// var font = "..."; // Base64 font string

// jsPDF.addFileToVFS("Arial.ttf", font);
// jsPDF.addFont("Arial.ttf", fontName, fontStyle);

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

	// const generatePDF = (teams) => {
	// 	const doc = new jsPDF();
	// 	doc.addFont(font, fontName, fontStyle); // Add the font
	// 	const tableRows = [];

	// 	teams.forEach((team) => {
	// 		const teamData = {
	// 			"Team Name": team.team_name,
	// 			"Global Rating": team.global_rating,
	// 			Points: team.team_points,
	// 		};
	// 		tableRows.push(teamData);
	// 	});

	// 	doc.autoTable({
	// 		columns: [
	// 			{ header: "Team Name", dataKey: "Team Name" },
	// 			{ header: "Global Rating", dataKey: "Global Rating" },
	// 			{ header: "Points", dataKey: "Points" },
	// 		],
	// 		body: tableRows,
	// 		startY: 20,
	// 	});
	// 	doc.save(`report_${Date().split(" ").join("_")}.pdf`);
	// };

	const generatePDF = (teams) => {
		const teamData = teams.map((team) => [
			team.team_name,
			team.global_rating,
			team.team_points,
		]);

		let docDefinition = {
			content: [
				{
					table: {
						headerRows: 1,
						body: [["Team Name", "Global Rating", "Points"], ...teamData],
					},
				},
			],
		};

		pdfMake.createPdf(docDefinition).open();
	};

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
							setTeams(teams.filter((team) => team.team_id !== id));
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

	const updateTeam = async (teamData) => {
		const response = await fetch(
			`http://localhost:5000/api/team/teamEdit/${editingTeam.team_id}`,
			{
				method: "PUT",
				body: teamData,
			}
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const updatedTeamResponse = await fetch(
			`http://localhost:5000/api/team/${editingTeam.team_id}`
		);
		const updatedTeam = await updatedTeamResponse.json();

		setTeams(
			teams.map((team) =>
				team.team_id === editingTeam.team_id ? updatedTeam : team
			)
		);

		closeEditModal();
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
								console.log(reloadCount);
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
	}, []);

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
