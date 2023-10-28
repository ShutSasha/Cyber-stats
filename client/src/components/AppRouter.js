import React from 'react'
import { useRoutes } from 'react-router-dom'
import { publicRoutes } from '../routes'
import Tournament from '../pages/Tournament'
import TournamentMatches from '../pages/TournamentMathces'
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function AppRouter () {
	const routing = useRoutes(
		[
			...publicRoutes.map(({ path, Component }) => ({ path, element: <Component /> })),
			{ path: '/tournament', element: <Tournament /> },
			{ path: '/tournaments/:id', element: <TournamentMatches /> },
			{ path: '*', element: <Tournament /> }
		],
	)

	return (
		<div>
			<Navbar bg="light" variant="light">
				<Navbar.Brand href="/">My App</Navbar.Brand>
				<Nav className="mr-auto">
					<Nav.Link as={Link} to="/tournament">Tournaments</Nav.Link>
					<Nav.Link as={Link} to="/team">Team</Nav.Link>
					<Nav.Link as={Link} to="/match">matchs</Nav.Link>
					<Nav.Link as={Link} to="/query-to-db">Query</Nav.Link>
				</Nav>
			</Navbar>
			{routing}
		</div>
	);
}

export default AppRouter
