import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function EditTournamentModal({ show, onClose, onUpdate, editingTournament }) {
	const [tournamentName, setTournamentName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [place, setPlace] = useState("");
	const [prizeFund, setPrizeFund] = useState(0);

	useEffect(() => {
		if (editingTournament) {
			setTournamentName(editingTournament.tournament_name);
			setStartDate(editingTournament.tournamen_date_start);
			setEndDate(editingTournament.tournamen_date_end);
			setPlace(editingTournament.tournament_place);
			setPrizeFund(editingTournament.prize_fund);
		}
	}, [editingTournament]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const tournamentData = {
			tournament_name: tournamentName,
			tournamen_date_start: startDate,
			tournamen_date_end: endDate,
			tournament_place: place,
			prize_fund: prizeFund,
		};

		onUpdate(tournamentData);
	};

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit tournament</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "10px" }}
				>
					<label>
						Name of tournament:
						<input
							type="text"
							value={tournamentName}
							onChange={(e) => setTournamentName(e.target.value)}
						/>
					</label>
					<label>
						Start date:
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</label>
					<label>
						End data:
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</label>
					<label>
						place:
						<input
							type="text"
							value={place}
							onChange={(e) => setPlace(e.target.value)}
						/>
					</label>
					<label>
						Prize fund:
						<input
							type="number"
							value={prizeFund}
							onChange={(e) => setPrizeFund(e.target.value)}
						/>
					</label>
					<input type="submit" value="Update tournament" />
				</form>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default EditTournamentModal;
