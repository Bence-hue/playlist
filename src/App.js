import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Landing from "./pages/Landing";
import ListSongs from "./pages/ListSongs";

import "./App.css";

function App() {
	return (
		<Router>
			<div className="App">
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/songs" component={ListSongs} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
