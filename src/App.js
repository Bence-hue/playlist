import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Preloader, Placeholder } from "react-preloading-screen";
import { BreakpointProvider, setDefaultBreakpoints } from "react-socks";

import loader from "./assets/Preloader2.gif";

import Landing from "./pages/Landing";
import ListSongs from "./pages/ListSongs";
import NewSong from "./pages/NewSong";
import CookiesPage from "./pages/CookiesPage";

import ErrorHandler from "./pages/components/ErrorHandler";

import "./css/app.css";

function App() {
	setDefaultBreakpoints([
		{ mobile: 0 },
		{ tabletp: 600 },
		{ tabletl: 900 },
		{ laptop: 1200 },
		{ HD: 1800 }
	]);
	return (
		<Router>
			<ErrorHandler>
				<Preloader>
					<Placeholder>
						<img src={loader} alt="Loading..." className="preloader-img" />
					</Placeholder>

					<BreakpointProvider>
						<div className="App">
							<Switch>
								<Route exact path="/" component={Landing} />
								<Route exact path="/songs" component={ListSongs} />
								<Route exact path="/new" component={NewSong} />
								<Route exact path="/cookies" component={CookiesPage} />
								<Route component="" />
							</Switch>
						</div>
					</BreakpointProvider>
				</Preloader>
			</ErrorHandler>
		</Router>
	);
}

export default App;
