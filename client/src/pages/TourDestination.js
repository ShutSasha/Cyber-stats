import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import EditTourDestination from '../components/EditTourDestination';
import TourDestinationModal from '../components/TourDestinationModal';

function TourDestination() {
	const [tourDestinations, setTourDestinations] = useState([]);
	const [teams, setTeams] = useState([]);
	const [tournaments, setTournaments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingTourDestination, setEditingTourDestination] = useState(null);

	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	const createTourDestination = (tourDestinationData) => {
		axios.post('http://localhost:5000/api/tour-destinations', tourDestinationData)
			.then(response => {
				setTourDestinations([...tourDestinations, response.data]);
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};

	const deleteTourDestination = (id) => {

		axios.delete(`http://localhost:5000/api/tour-destinations/${id}`)
			.then(response => {
				setTourDestinations(tourDestinations.filter(tourDestination => tourDestination.tour_destination_id !== id));
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};

	const updateTourDestination = (id, updatedTourDestinationData) => {
		axios.put(`http://localhost:5000/api/tour-destinations/${id}`, updatedTourDestinationData)
			.then(response => {
				setTourDestinations(tourDestinations.map(tourDestination =>
					tourDestination.tour_destination_id === id ? { ...tourDestination, ...updatedTourDestinationData } : tourDestination
				));
	
				axios.get('http://localhost:5000/api/tour-destinations')
					.then(response => {
						setTourDestinations(response.data);
					})
					.catch(error => {
						console.error(`Error: ${error}`);
					});
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	};
	

	useEffect(() => {
		axios.get('http://localhost:5000/api/tour-destinations')
			.then(response => {
				setTourDestinations(response.data);
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	}, []);

	useEffect(() => {
		axios.get('http://localhost:5000/api/team')
			.then(response => {
				setTeams(response.data.rows);
			})
			.catch(error => {
				console.error(`Error: ${error}`);
			});
	}, []);

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
			<h1>Tour destination</h1>
			<Button onClick={openModal}>Create</Button>

			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Team name</th>
						<th>Tournament name</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{tourDestinations.map((tourDestination, index) => {
						const team = teams.find(team => team.team_id === tourDestination.teamTeamId);
						const tournament = tournaments.find(tournament => tournament.tournament_id === tourDestination.tournamentTournamentId);
						
						return (
							<tr key={index}>
								<td>{team ? team.team_name : 'N/A'}</td>
								<td>{tournament ? tournament.tournament_name : 'N/A'}</td>
								<td style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
								<Button variant="primary" onClick={() => { setEditingTourDestination(tourDestination); openEditModal(); }}>Edit</Button>
									<Button variant='danger' onClick={() => deleteTourDestination(tourDestination.tour_destination_id)}>Delete</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>

			<TourDestinationModal
			show={showModal}
			onClose={closeModal}
			onCreate={createTourDestination}
			/>



			<EditTourDestination
				show={showEditModal}
				onClose={closeEditModal}
				onUpdate={(updatedTourDestinationData) => updateTourDestination(editingTourDestination.tour_destination_id, updatedTourDestinationData)}
				editingTourDestination={editingTourDestination}
			/>
		</div>
	)
}

export default TourDestination
