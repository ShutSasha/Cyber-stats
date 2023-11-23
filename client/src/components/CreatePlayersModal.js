import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function CreatePlayersModal({ show, onClose, onCreate, numberTeam }) {
	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create Players</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				If u wanna create players for team {numberTeam} click on button
				Create
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onCreate}>
					Create
				</Button>
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default CreatePlayersModal;
