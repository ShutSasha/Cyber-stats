import React, { useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

function QueryToDB() {
	const [query, setQuery] = useState("");
	const [result, setResult] = useState(null);

	const requests = [
		`SELECT e.name, e.surname, t.team_name
		FROM public.esports_players e
		JOIN public.teams t ON e."teamTeamId" = t.team_id
		WHERE t.global_rating = (SELECT MIN(global_rating) FROM public.teams);
		`,
		`SELECT t.tournament_name, COUNT(distinct td."teamTeamId") as team_count
	FROM public.tournaments t
	JOIN public.tour_destinations td ON t.tournament_id = td."tournamentTournamentId"
	GROUP BY t.tournament_name;
	`,
		`SELECT esports_player_id, name, surname, global_rating, esports_player_points
	FROM public.esports_players
	ORDER BY global_rating ASC
	LIMIT 3;
	`,
	];

	const requestsName = [
		"Запит на отримання імені та прізвища гравців, які належать до команди з найвищим глобальним рейтингом:",
		"Запит на отримання імені турніру та кількості команд, які в ньому брали участь:",
		"Знайти топ-3 гравців з найвищим рейтингом",
	];

	const handleButtonClick = (index) => {
		setQuery(requests[index]);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!query) {
			toast.error(`Потрібно ввести запит`);
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:5000/api/query-to-db",
				{ query }
			);
			if (!response.data || response.data.length === 0) {
				toast.error("Неправильний запит");
				return;
			}
			setResult(response.data);
		} catch (error) {
			toast.error("Неправильний запит");
			console.error(error);
		}
	};

	const handleClear = () => {
		setQuery("");
		setResult(null);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<textarea
						style={{
							width: "800px",
							height: "250px",
							marginBottom: "30px",
						}}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<div className=" d-flex justify-content-center flex-column">
						<Button
							style={{ marginBottom: "10px" }}
							className="col-3"
							variant="primary"
							type="submit"
						>
							Виконати запит
						</Button>
						<Button
							className="col-3"
							style={{ marginBottom: "10px" }}
							variant="secondary"
							onClick={handleClear}
						>
							Очистити
						</Button>

						{requestsName.map((name, index) => (
							<Button
								className="col-3 d-flex justify-content-center"
								style={{ marginBottom: "10px" }}
								variant="success"
								key={index}
								onClick={() => handleButtonClick(index)}
							>
								{name}
							</Button>
						))}
					</div>
				</div>
			</form>
			{result && result.length > 0 ? (
				<Table striped bordered hover>
					<thead>
						<tr>
							{Object.keys(result[0]).map((key) => (
								<th key={key}>{key}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{result.map((row, index) => (
							<tr key={index}>
								{Object.values(row).map((value, i) => (
									<td key={i}>{value}</td>
								))}
							</tr>
						))}
					</tbody>
				</Table>
			) : (
				<p>Немає результатів для відображення</p>
			)}
		</div>
	);
}

export default QueryToDB;
