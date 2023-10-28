import React, { useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

function QueryToDB () {
	const [query, setQuery] = useState('');
	const [result, setResult] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post('http://localhost:5000/api/query-to-db', { query });
			setResult(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<textarea style={{ width: '500px' }} value={query} onChange={(e) => setQuery(e.target.value)} />
				<button type="submit">Выполнить запрос</button>
			</form>
			{result && (
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
			)}

		</div>
	);
}

export default QueryToDB;
