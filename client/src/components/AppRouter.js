import React from 'react'
import { useRoutes } from 'react-router-dom'
import { publicRoutes } from '../routes'
import Tournament from '../pages/Tournament'

function AppRouter () {
	const routing = useRoutes(
		[
			...publicRoutes.map(({ path, Component }) => ({ path, element: <Component /> })),
			{ path: '/tournament', element: <Tournament /> },
			{ path: '*', element: <Tournament /> }
		],
	)
	return routing
}

export default AppRouter
