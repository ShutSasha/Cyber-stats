import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function TeamModal ({ show, onClose, setTeams, teams }) {
	const [teamName, setTeamName] = useState("");
	const [country, setCountry] = useState("");
	const [dateOfCreation, setDateOfCreation] = useState("");
	const [coach, setCoach] = useState("");
	const [globalRating, setGlobalRating] = useState(0);
	const [points, setPoints] = useState(0);
	const [image, setImage] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('team_name', teamName);
		formData.append('team_country', country);
		formData.append('date_of_creating_team', dateOfCreation);
		formData.append('coach_team', coach);
		formData.append('global_rating', globalRating);
		formData.append('team_points', points);
		formData.append('img', image);

		try {
			const response = await fetch('http://localhost:5000/api/team', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data = await response.json();
			console.log(data);
			setTeams([...teams, data]);
			onClose();
		} catch (error) {
			console.error(error);
		}
	};



	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create team</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
					<label>
						Name of team:
						<input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} />
					</label>
					<label>
						Country:
						<input type="text" value={country} onChange={e => setCountry(e.target.value)} />
					</label>
					<label>
						Date of creation:
						<input type="date" value={dateOfCreation} onChange={e => setDateOfCreation(e.target.value)} />
					</label>
					<label>
						Coach:
						<input type="text" value={coach} onChange={e => setCoach(e.target.value)} />
					</label>
					<label>
						Global rating:
						<input type="number" value={globalRating} onChange={e => setGlobalRating(e.target.value)} />
					</label>
					<label>
						Points:
						<input type="number" value={points} onChange={e => setPoints(e.target.value)} />
					</label>
					<label>
						Image:
						<input type="file" onChange={e => setImage(e.target.files[0])} />
					</label>
					<input type="submit" value="Create team" />
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

export default TeamModal;
