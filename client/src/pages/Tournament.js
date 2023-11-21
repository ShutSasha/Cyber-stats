import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import TournamentModal from "../components/TournamentModal";
import EditTournamentModal from "../components/EditTournamentModal";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Tournament() {
	const [tournaments, setTournaments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingTournament, setEditingTournament] = useState(null);
	const [prizeFilter, setPrizeFilter] = useState(null);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

	const handlePrizeFilterChange = (event) => {
		setPrizeFilter(event.target.value);
	};

	const filteredTournaments = tournaments.filter((tournament) => {
		if (prizeFilter === "0-100000") {
			return tournament.prize_fund >= 0 && tournament.prize_fund <= 100000;
		} else if (prizeFilter === "100000-500000") {
			return (
				tournament.prize_fund > 100000 && tournament.prize_fund <= 500000
			);
		} else if (prizeFilter === "500000+") {
			return tournament.prize_fund > 500000;
		} else {
			return true;
		}
	});

	const generatePDF = (tournaments) => {
		const currentDate = new Date();

		const relevantTournaments = tournaments.filter((tournament) => {
			const tournamentStartDate = new Date(tournament.tournamen_date_start);
			const tournamentEndDate = new Date(tournament.tournamen_date_end);
			return (
				(tournamentStartDate <= currentDate &&
					tournamentEndDate >= currentDate) ||
				(tournamentStartDate >= currentDate &&
					tournamentEndDate >= currentDate)
			);
		});

		const day = currentDate.getDate();
		const month = currentDate.getMonth() + 1;
		const year = currentDate.getFullYear();
		const formattedDate = `Current date in dd/mm/yyyy: ${day}/${month}/${year}`;

		const tournamentData = relevantTournaments.map((tournament) => [
			tournament.tournament_name,
			tournament.tournamen_date_start,
			tournament.tournamen_date_end,
			tournament.tournament_place,
			`${tournament.prize_fund}$`,
		]);

		let docDefinition = {
			content: [
				{
					style: "header",
					text: "Турніри, які зараз проводяться або будуть проводитись",
				},
				{
					columns: [
						{ width: "*", text: "" },
						{
							width: "auto",
							table: {
								headerRows: 1,
								body: [
									[
										{ text: "Tournament Name", alignment: "center" },
										{ text: "Date start", alignment: "center" },
										{ text: "Date end", alignment: "center" },
										{ text: "Place", alignment: "center" },
										{ text: "Prize fund", alignment: "center" },
									],
									...tournamentData.map((row) =>
										row.map((cell) => ({
											text: cell,
											alignment: "center",
										}))
									),
								],
							},
						},
						{ width: "*", text: "" },
					],
				},
				{
					style: "date",
					text: formattedDate,
				},
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10],
					alignment: "center",
				},
				date: {
					margin: [0, 10, 0, 0],
				},
			},
		};

		pdfMake.createPdf(docDefinition).open();
	};

	const createTournament = (tournamentData) => {
		for (let key in tournamentData) {
			if (!tournamentData[key]) {
				alert(`Будь ласка, заповніть поле ${key}`);
				return;
			}
		}

		if (
			new Date(tournamentData.tournamen_date_start) >
			new Date(tournamentData.tournamen_date_end)
		) {
			alert("Дата початку турніру не може бути пізніше дати закінчення.");
			return;
		}

		if (Number(tournamentData.prize_fund) < 0) {
			alert("Призовий фонд не може бути меншимим за 0.");
			return;
		}

		axios
			.post("http://localhost:5000/api/tournament", tournamentData)
			.then((response) => {
				console.log(response.data);
				setTournaments([...tournaments, response.data]);
				closeModal();
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	const deleteTournament = (id) => {
		axios
			.delete(`http://localhost:5000/api/tournament/tournamentDel/${id}`)
			.then((response) => {
				console.log(response.data);
				setTournaments(
					tournaments.filter(
						(tournament) => tournament.tournament_id !== id
					)
				);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
				if (
					(error.response && error.response.status === 400) ||
					(error.response && error.response.status === 404)
				) {
					toast.error(
						"Можливо ви намагаєтесь видалити турнір, який має зв'язані записи."
					);
				}
			});
	};

	const updateTournament = (id, updatedTournamentData) => {
		for (let key in updatedTournamentData) {
			if (!updatedTournamentData[key]) {
				alert(`Будь ласка, заповніть поле ${key}`);
				return;
			}
		}

		if (
			new Date(updatedTournamentData.tournamen_date_start) >
			new Date(updatedTournamentData.tournamen_date_end)
		) {
			alert("Дата початку турніру не може бути пізніше дати закінчення.");
			return;
		}

		if (updatedTournamentData.prize_fund < 0) {
			alert("Призовий фонд не може бути меншимим за 0.");
			return;
		}

		axios
			.put(
				`http://localhost:5000/api/tournament/tournamentEdit/${id}`,
				updatedTournamentData
			)
			.then((response) => {
				setTournaments(
					tournaments.map((tournament) =>
						tournament.tournament_id === id
							? { ...tournament, ...updatedTournamentData }
							: tournament
					)
				);
				closeEditModal();
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/tournament")
			.then((response) => {
				setTournaments(response.data);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	return (
		<div>
			<h1>Tournaments</h1>
			<h5>
				Згенеруй звіт про турніри, які проводяться зараз або будуть
				проводитись в майбутньому
			</h5>
			<Button onClick={() => generatePDF(tournaments)}>
				Generate Report
			</Button>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<h5>Select prize fund</h5>
				<label>
					<input
						type="radio"
						value="all"
						checked={prizeFilter === null}
						onChange={() => setPrizeFilter(null)}
					/>
					All
				</label>
				<label>
					<input
						type="radio"
						value="0-100000"
						checked={prizeFilter === "0-100000"}
						onChange={handlePrizeFilterChange}
					/>
					0-100000
				</label>
				<label>
					<input
						type="radio"
						value="100000-500000"
						checked={prizeFilter === "100000-500000"}
						onChange={handlePrizeFilterChange}
					/>
					100000-500000
				</label>
				<label>
					<input
						type="radio"
						value="500000+"
						checked={prizeFilter === "500000+"}
						onChange={handlePrizeFilterChange}
					/>
					500000+
				</label>
			</div>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Tournament Name</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Place</th>
						<th>Prize Fund</th>
					</tr>
				</thead>
				<tbody>
					{filteredTournaments.map((tournament) => (
						<tr key={tournament.tournament_id}>
							<td>{tournament.tournament_name}</td>
							<td>{tournament.tournamen_date_start}</td>
							<td>{tournament.tournamen_date_end}</td>
							<td>{tournament.tournament_place}</td>
							<td>{tournament.prize_fund}$</td>
							<td>
								<div
									style={{
										display: "flex",
										justifyContent: "space-around",
										alignItems: "center",
									}}
								>
									<Link
										to={`/tournaments/${tournament.tournament_id}`}
									>
										<Button variant="info">View</Button>
									</Link>

									<Button
										variant="danger"
										onClick={() =>
											deleteTournament(tournament.tournament_id)
										}
									>
										Delete
									</Button>
									<Button
										variant="primary"
										onClick={() => {
											setEditingTournament(tournament);
											openEditModal();
										}}
									>
										Edit
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<Button onClick={openModal}>Create Tournament</Button>

			<TournamentModal
				show={showModal}
				onClose={closeModal}
				onCreate={createTournament}
			/>

			<EditTournamentModal
				show={showEditModal}
				onClose={closeEditModal}
				onUpdate={(updatedTournamentData) =>
					updateTournament(
						editingTournament.tournament_id,
						updatedTournamentData
					)
				}
				editingTournament={editingTournament}
			/>
		</div>
	);
}

export default Tournament;
