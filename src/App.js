import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Preloader, Placeholder } from "react-preloading-screen";

import loader from "./assets/Preloader2.gif";

import Landing from "./pages/Landing";
import ListSongs from "./pages/ListSongs";
import NewSong from "./pages/NewSong";
import CookiesPage from "./pages/CookiesPage";

import ErrorHandler from "./pages/components/ErrorHandler";

function App() {
	return (
		<Router>
			<ErrorHandler>
				<Preloader>
					<Placeholder>
						<img src={loader} alt="Loading..." />
					</Placeholder>

					<div className="App">
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route exact path="/songs" component={ListSongs} />
							<Route exact path="/new" component={NewSong} />
							{/* <Route exact path="/new" component={NewSong} /> */}
							<Route exact path="/cookies" component={CookiesPage} />
							<Route component="" />
						</Switch>
					</div>
				</Preloader>
			</ErrorHandler>
		</Router>
	);
}

export default App;
