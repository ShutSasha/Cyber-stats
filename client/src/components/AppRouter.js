import React from "react";
import { useRoutes } from "react-router-dom";
import { publicRoutes } from "../routes";
import Tournament from "../pages/Tournament";
import TournamentMatches from "../pages/TournamentMathces";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import MainPage from "../pages/MainPage";
import { NavLink } from "react-router-dom";

function AppRouter() {
	const routing = useRoutes([
		...publicRoutes.map(({ path, Component }) => ({
			path,
			element: <Component />,
		})),
		{ path: "/tournament", element: <Tournament /> },
		{ path: "/tournaments/:id", element: <TournamentMatches /> },
		{ path: "*", element: <MainPage /> },
	]);

	return (
		<div>
			<Navbar bg="light" variant="light">
				<Navbar.Brand href="/">My App</Navbar.Brand>
				<Nav className="mr-auto">
					<NavLink style={{ textDecoration: "none" }} to="/tournament">
						<Nav.Link as="div">
							{window.location.pathname === "/tournament"
								? "🔵 Tournaments"
								: "Tournaments"}
						</Nav.Link>
					</NavLink>
					<NavLink style={{ textDecoration: "none" }} to="/team">
						<Nav.Link as="div">
							{window.location.pathname === "/team" ? "🔵 Team" : "Team"}
						</Nav.Link>
					</NavLink>
					<NavLink
						style={{ textDecoration: "none" }}
						to="/tour-destination"
					>
						<Nav.Link as="div">
							{window.location.pathname === "/tour-destination"
								? "🔵 Tour destination"
								: "Tour destination"}
						</Nav.Link>
					</NavLink>
					<NavLink style={{ textDecoration: "none" }} to="/match">
						<Nav.Link as="div">
							{window.location.pathname === "/match"
								? "🔵 Matches"
								: "Matches"}
						</Nav.Link>
					</NavLink>
					<NavLink style={{ textDecoration: "none" }} to="/player">
						<Nav.Link as="div">
							{window.location.pathname === "/player"
								? "🔵 Player"
								: "Player"}
						</Nav.Link>
					</NavLink>
					<NavLink style={{ textDecoration: "none" }} to="/query-to-db">
						<Nav.Link as="div">
							{window.location.pathname === "/query-to-db"
								? "🔵 Query"
								: "Query"}
						</Nav.Link>
					</NavLink>
				</Nav>
			</Navbar>
			{routing}
		</div>
	);
}

export default AppRouter;
