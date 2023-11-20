import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function EditTeamModal({ show, onClose, onUpdate, editingTeam }) {
	const [teamName, setTeamName] = useState("");
	const [country, setCountry] = useState("");
	const [dateOfCreation, setDateOfCreation] = useState("");
	const [coach, setCoach] = useState("");
	const [points, setPoints] = useState(0);
	const [img, setImg] = useState(null);

	useEffect(() => {
		if (editingTeam) {
			setTeamName(editingTeam.team_name);
			setCountry(editingTeam.team_country);
			setDateOfCreation(editingTeam.date_of_creating_team);
			setCoach(editingTeam.coach_team);
			setPoints(editingTeam.team_points);
			setImg(null);
		}
	}, [editingTeam]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const teamData = new FormData();
		teamData.append("team_name", teamName);
		teamData.append("team_country", country);
		teamData.append("date_of_creating_team", dateOfCreation);
		teamData.append("coach_team", coach);
		teamData.append("team_points", Number(points));
		if (img) {
			teamData.append("img", img);
		}

		onUpdate(teamData);
	};

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit team</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					encType="multipart/form-data"
				>
					<label>
						Name of team:
						<input
							type="text"
							value={teamName}
							onChange={(e) => setTeamName(e.target.value)}
						/>
					</label>
					<label>
						Country:
						<input
							type="text"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
						/>
					</label>
					<label>
						Date of creation:
						<input
							type="date"
							value={dateOfCreation}
							onChange={(e) => setDateOfCreation(e.target.value)}
						/>
					</label>
					<label>
						Coach:
						<input
							type="text"
							value={coach}
							onChange={(e) => setCoach(e.target.value)}
						/>
					</label>
					<label>
						Points:
						<input
							type="number"
							value={points}
							onChange={(e) => setPoints(e.target.value)}
						/>
					</label>
					<label>
						Image:
						<input
							type="file"
							onChange={(e) => setImg(e.target.files[0])}
						/>
					</label>
					<input type="submit" value="Update team" />
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

export default EditTeamModal;
