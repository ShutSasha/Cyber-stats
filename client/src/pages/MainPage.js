import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';

const styles = {
	customFont: {
		fontFamily: 'Agbalumo, sans-serif', 
	},
};

function MainPage() {
	return (
	<>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" />
		<h1 style={styles.customFont} className='display-2 text-center mt-3'>Welcome to Statistical analysis of eSports matches</h1>
		<p className='text-center display-6'>Here you can create tournaments, teams, matches and even players! An incredible web application that helps with eSports statistics</p>
	</>
	)
}

export default MainPage