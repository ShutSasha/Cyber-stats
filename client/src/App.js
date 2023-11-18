import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<div style={{ padding: "0 10px 0 10px" }}>
			<BrowserRouter>
				<AppRouter />
				<ToastContainer />
			</BrowserRouter>
		</div>
	);
}

export default App;
