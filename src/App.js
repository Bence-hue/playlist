import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Preloader, Placeholder } from "react-preloading-screen";

import Landing from "./pages/Landing";
import ListSongs from "./pages/ListSongs";
import NewSong from "./pages/NewSong";

function App() {
	return (
		<Router>
			<Preloader>
				<Placeholder>
					<h1>Loading</h1>
				</Placeholder>

				<div className="App">
					<Switch>
						<Route exact path="/" component={Landing} />
						<Route exact path="/songs" component={ListSongs} />
						<Route exact path="/new" component={NewSong} />
						<Route component={""} />
					</Switch>
				</div>
			</Preloader>
		</Router>
	);
}

export default App;
