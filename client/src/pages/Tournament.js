import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import TournamentModal from '../components/TournamentModal';
import EditTournamentModal from '../components/EditTournamentModal'

function Tournament () {
	const [tournaments, setTournaments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingTournament, setEditingTournament] = useState(null);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

	const createTournament = (tournamentData) => {
		axios.post('http://localhost:5000/api/tournament', tournamentData)
			.then(response => {
				console.log(response.data);
				setTournaments([...tournaments, response.data]);
				closeModal();
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};

	const deleteTournament = (id) => {
		axios.delete(`http://localhost:5000/api/tournament/tournamentDel/${id}`)
			.then(response => {
				console.log(response.data);
				setTournaments(tournaments.filter(tournament => tournament.tournament_id !== id));
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};

	const updateTournament = (id, updatedTournamentData) => {
		axios.put(`http://localhost:5000/api/tournament/tournamentEdit/${id}`, updatedTournamentData)
			.then(response => {
				setTournaments(tournaments.map(tournament =>
					tournament.tournament_id === id ? { ...tournament, ...updatedTournamentData } : tournament
				));
				closeEditModal();
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};

	useEffect(() => {
		axios.get('http://localhost:5000/api/tournament')
			.then(response => {
				setTournaments(response.data);
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	}, []);

	return (
		<div>
			<h1>Tournaments</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Tournament Name</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Place</th>
						<th>Prize Fund</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{tournaments.map(tournament => (
						<tr key={tournament.tournament_id}>
							<td>{tournament.tournament_name}</td>
							<td>{tournament.tournamen_date_start}</td>
							<td>{tournament.tournamen_date_end}</td>
							<td>{tournament.tournament_place}</td>
							<td>{tournament.prize_fund}$</td>
							<td>{tournament.tournament_points}</td>
							<td>
								<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
									<button onClick={() => deleteTournament(tournament.tournament_id)}>
										Delete
									</button>
									<button onClick={() => { setEditingTournament(tournament); openEditModal(); }}>
										Edit
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>

			</Table>

			<button onClick={openModal}>Create Tournament</button>

			<TournamentModal
				show={showModal}
				onClose={closeModal}
				onCreate={createTournament}
			/>

			<EditTournamentModal
				show={showEditModal}
				onClose={closeEditModal}
				onUpdate={(updatedTournamentData) => updateTournament(editingTournament.tournament_id, updatedTournamentData)}
				editingTournament={editingTournament}
			/>

		</div>
	);
}

export default Tournament;