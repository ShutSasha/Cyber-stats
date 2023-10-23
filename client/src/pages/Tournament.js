import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import TournamentModal from '../components/TournamentModal';

function Tournament () {
	const [tournaments, setTournaments] = useState([]);
	const [showModal, setShowModal] = useState(false);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

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

	useEffect(() => {
		axios.get('http://localhost:5000/api/tournament')
			.then(response => {
				setTournaments(response.data);
				console.log(response.data);
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
							<td>{tournament.prize_fund}</td>
							<td>{tournament.tournament_points}</td>
							<td>
								<button onClick={() => deleteTournament(tournament.tournament_id)}>
									Delete
								</button>
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
		</div>
	);
}

export default Tournament;
