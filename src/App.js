import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Landing from "./pages/Landing";
import ListSongs from "./pages/ListSongs";
import NewSong from "./pages/NewSong";

function App() {
	return (
		<Router>
			<div className="App">
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/songs" component={ListSongs} />
					<Route exact path="/new" component={NewSong} />
					<Route component={""} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
