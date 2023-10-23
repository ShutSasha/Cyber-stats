import React from 'react'
import { Routes, Route, } from 'react-router-dom'
import { publicRoutes } from '../routes'

function AppRouter () {
	return (
		<Routes>
			{publicRoutes.map(({ path, Component }) =>
				<Route key={path} path={path} Component={Component} exact />
			)}
		</Routes>
	)
}

export default AppRouter