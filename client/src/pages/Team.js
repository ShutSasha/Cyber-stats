import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import TeamModal from '../components/TeamModal';
import EditTeamModal from '../components/EditTeamModal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';


function Team () {
	const [teams, setTeams] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingTeam, setEditingTeam] = useState(null);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

	const deleteTeam = (id) => {
		axios.get(`http://localhost:5000/api/match`)
			.then(response => {
				let isExist = false;
				response.data.forEach(element => {
					if (element.team1_id === id || element.team2_id === id) {
						isExist = true
					}
				});
				if (isExist) {
					toast.error('Cannot delete team with associated matches');
				} else {
					console.log('EREOROEROEORE');
					axios.delete(`http://localhost:5000/api/team/teamDel/${id}`)
						.then(response => {
							setTeams(teams.filter(team => team.team_id !== id));
						})
						.catch(error => {
							console.error(`Error: ${error}`);
							toast.error('Error deleting team');
						});
				}
			})
			.catch(error => {
				console.error(`Error: ${error}`);
				toast.error('Error fetching matches for team');
			});
	};


	const updateTeam = async (teamData) => {
		const response = await fetch(`http://localhost:5000/api/team/teamEdit/${editingTeam.team_id}`, {
			method: 'PUT',
			body: teamData,
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const updatedTeamResponse = await fetch(`http://localhost:5000/api/team/${editingTeam.team_id}`);
		const updatedTeam = await updatedTeamResponse.json();

		setTeams(teams.map(team =>
			team.team_id === editingTeam.team_id ? updatedTeam : team
		));

		closeEditModal();
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
							<td>
								{team.img && <img src={`http://localhost:5000/${team.img}`} alt={team.team_name} style={{ width: '70px', height: '70px' }} />}
							</td>
							<td>{team.team_name}</td>
							<td>{team.team_country}</td>
							<td>{team.date_of_creating_team}</td>
							<td>{team.coach_team}</td>
							<td>{team.global_rating}</td>
							<td>{team.team_points}</td>
							<td>
								<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
									<Button variant="danger" onClick={() => deleteTeam(team.team_id)}>Delete</Button>
									<Button variant="primary" onClick={() => { setEditingTeam(team); openEditModal(); }}>Edit</Button>
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