// import React, { useState } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';

// function TournamentModal ({ show, onClose, onCreate }) {
// 	const [tournamentName, setTournamentName] = useState("");
// 	const [startDate, setStartDate] = useState("");
// 	const [endDate, setEndDate] = useState("");
// 	const [place, setPlace] = useState("");
// 	const [prizeFund, setPrizeFund] = useState(0);
// 	const [points, setPoints] = useState(0);

// 	const handleSubmit = (event) => {
// 		event.preventDefault();

// 		const tournamentData = {
// 			tournament_name: tournamentName,
// 			tournamen_date_start: startDate,
// 			tournamen_date_end: endDate,
// 			tournament_place: place,
// 			prize_fund: prizeFund,
// 			tournament_points: points
// 		};

// 		onCreate(tournamentData);
// 	};

// 	return (
// 		<Modal show={show} onHide={onClose}>
// 			<Modal.Header closeButton>
// 				<Modal.Title>Создать турнир</Modal.Title>
// 			</Modal.Header>
// 			<Modal.Body>
// 				<form onSubmit={handleSubmit}>
// 					{/* Здесь ваша форма */}
// 				</form>
// 			</Modal.Body>
// 			<Modal.Footer>
// 				<Button variant="secondary" onClick={onClose}>
// 					Закрыть
// 				</Button>
// 			</Modal.Footer>
// 		</Modal>
// 	);
// }

// export default TournamentModal;
