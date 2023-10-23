import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function TournamentModal ({ show, onClose, onCreate }) {
	const [tournamentName, setTournamentName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [place, setPlace] = useState("");
	const [prizeFund, setPrizeFund] = useState(0);
	const [points, setPoints] = useState(0);

	const handleSubmit = (event) => {
		event.preventDefault();

		const tournamentData = {
			tournament_name: tournamentName,
			tournamen_date_start: startDate,
			tournamen_date_end: endDate,
			tournament_place: place,
			prize_fund: prizeFund,
			tournament_points: points
		};

		onCreate(tournamentData);
	};

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Создать турнир</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
				<Button variant="secondary" onClick={onClose}>
					Закрыть
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default TournamentModal;
