import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";

function App () {
	return (
		<div style={{ padding: '0 10px 0 10px' }}>
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</div>

	);
}

export default App;
