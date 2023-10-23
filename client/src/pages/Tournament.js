import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import TournamentModal from './TournamentModal';

function Tournament () {
	const [tournaments, setTournaments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [tournamentName, setTournamentName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [place, setPlace] = useState("");
	const [prizeFund, setPrizeFund] = useState(0);
	const [points, setPoints] = useState(0);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	const createTournament = () => {
		const tournamentData = {
			tournament_name: tournamentName,
			tournamen_date_start: startDate,
			tournamen_date_end: endDate,
			tournament_place: place,
			prize_fund: prizeFund,
			tournament_points: points
		};

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
									Удалить
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			<button onClick={openModal}>Создать турнир</button>

			<Modal show={showModal} onHide={closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Создать турнир</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={createTournament} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
						<label>
							Name of tournament:
							<input type="text" value={tournamentName} onChange={e => setTournamentName(e.target.value)} />
						</label>
						<label>
							Start date:
							<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
						</label>
						<label>
							End data:
							<input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
						</label>
						<label>
							place:
							<input type="text" value={place} onChange={e => setPlace(e.target.value)} />
						</label>
						<label>
							Prize fund:
							<input type="number" value={prizeFund} onChange={e => setPrizeFund(e.target.value)} />
						</label>
						<label>
							Points:
							<input type="number" value={points} onChange={e => setPoints(e.target.value)} />
						</label>
						<input type="submit" value="Создать турнир" />
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={closeModal}>
						Закрыть
					</Button>
				</Modal.Footer>
			</Modal>

		</div>
	);
}

export default Tournament;
