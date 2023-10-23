import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import TeamModal from '../components/TeamModal'; // Предполагается, что вы создали этот компонент
import EditTeamModal from '../components/EditTeamModal'; // Предполагается, что вы создали этот компонент

function Team () {
	const [teams, setTeams] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingTeam, setEditingTeam] = useState(null);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

	// const createTeam = async (formData) => {
	// 	fetch('http://localhost:5000/api/team', {
	// 		method: 'POST',
	// 		body: formData
	// 	}).then(res => {
	// 		console.log(res);
	// 		setTeams([...teams, res]);
	// 		closeModal();
	// 	})
	// 		.catch(err => {
	// 			console.error(`Error: ${err}`);
	// 		})
	// };


	const deleteTeam = (id) => {
		axios.delete(`http://localhost:5000/api/team/teamDel/${id}`)
			.then(response => {
				setTeams(teams.filter(team => team.team_id !== id));
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};

	const updateTeam = (id, updatedTeamData) => {
		axios.put(`http://localhost:5000/api/team/teamEdit/${id}`, updatedTeamData)
			.then(response => {
				setTeams(teams.map(team =>
					team.team_id === id ? { ...team, ...updatedTeamData } : team
				));
				closeEditModal();
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};

	useEffect(() => {
		axios.get('http://localhost:5000/api/team')
			.then(response => {
				setTeams(response.data.rows);
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	}, []);

	return (
		<div>
			<h1>Teams</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Image</th>
						<th>Team Name</th>
						<th>Country</th>
						<th>Date of Creation</th>
						<th>Coach</th>
						<th>Global Rating</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{teams.map(team => (
						<tr key={team.team_id}>
							<td><img src={`http://localhost:5000/${team.img}`} alt={team.team_name} style={{ width: '70px', height: '70px' }} /></td>
							<td>{team.team_name}</td>
							<td>{team.team_country}</td>
							<td>{team.date_of_creating_team}</td>
							<td>{team.coach_team}</td>
							<td>{team.global_rating}</td>
							<td>{team.team_points}</td>
							<td>
								<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
									<button onClick={() => deleteTeam(team.team_id)}>
										Delete
									</button>
									<button onClick={() => { setEditingTeam(team); openEditModal(); }}>
										Edit
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>

			</Table>

			<button onClick={openModal}>Create Team</button>

			<TeamModal
				show={showModal}
				onClose={closeModal}
				setTeams={setTeams}
				teams={teams}
			/>

			<EditTeamModal
				show={showEditModal}
				onClose={closeEditModal}
				onUpdate={(updatedTeamData) => updateTeam(editingTeam.team_id, updatedTeamData)}
				editingTeam={editingTeam}
			/>

		</div>
	);
}

export default Team;