import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Preloader, Placeholder } from "react-preloading-screen";
import { BreakpointProvider, setDefaultBreakpoints } from "react-socks";

import loader from "./assets/Preloader2.gif";

import Landing from "./pages/Landing";
import ListSongs from "./pages/ListSongs";
import NewSong from "./pages/NewSong";
import CookiesPage from "./pages/CookiesPage";
import About from "./pages/About";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ListSongsAdmin from "./pages/admin/ListSongsAdmin";
import ListUsersAdmin from "./pages/admin/ListUsers";

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
								<Route exact path="/static" component={Landing} />
								<Route exact path="/songs" component={ListSongs} />
								<Route exact path="/new" component={NewSong} />
								<Route exact path="/cookies" component={CookiesPage} />
								<Route exact path="/about" component={About} />

								<Route exact path="/admin/login" component={AdminLogin} />
								{/* prettier-ignore */}
								<Route exact path="/admin/dashboard" component={AdminDashboard} />
								<Route exact path="/admin/songs" component={ListSongsAdmin} />
								<Route exact path="/admin/users" component={ListUsersAdmin} />

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
