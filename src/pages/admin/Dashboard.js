import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../css/admin-css/dashboard.scss";

import Header from "../components/Header";

import { ReactComponent as DashbArtLeft } from "../../assets/Admin-landing-left.svg";
import { ReactComponent as DashbArtRight } from "../../assets/Admin-landing-right.svg";
import { ReactComponent as AddButton } from "../../assets/add-button.svg";
import { ReactComponent as MusicPlayer } from "../../assets/music-player.svg";
import { ReactComponent as Users } from "../../assets/users-solid.svg";
import { ReactComponent as Logout } from "../../assets/sign-out-alt-solid.svg";

export default class AdminDashboard extends Component {
	state = {
		username: "",
		stats: {}
	};

	componentDidMount() {
		let urlName = "/api/username/";
		let urlStats = "/api/statistics/";
		axios.get(urlName).then((res) => {
			this.setState({ username: res.data });
		});
		axios.get(urlStats).then((res) => {
			this.setState({ stats: res.data });
		});
	}
	render() {
		const { created, played, total } = this.state.stats;
		return (
			<div id="dashboard">
				<Header kolcsey={true} />

				{console.log(this.props)}

				<h1 className="db-greeting">
					Welcome back, <span>{this.state.username}</span> .
				</h1>

				<div className="db-stats">
					<h2>
						Az elmúlt{" "}
						<span className="db-time-selector">
							7 <i className="fas fa-chevron-down"></i>
						</span>{" "}
						napban...
					</h2>
					<div className="db-stats-flex">
						<p>Hozzáadott zenék:</p>
						<p>Lejátszott zenék:</p>
						<p>Listában összesen:</p>
						<i>{created}</i>
						<i>{played}</i>
						<i>{total}</i>
						<div className="db-stats__border"></div>
					</div>
				</div>

				<Link to="/admin/songs">
					<button className="db-button">
						<MusicPlayer />
					</button>
				</Link>
				<Link to="/new">
					<button className="db-button">
						<AddButton />
					</button>
				</Link>
				<Link to="/admin/users">
					<button className="db-button">
						<Users />
					</button>
				</Link>
				<a href="https://playlist.jelszo.co/api/logout/">
					<button className="db-button">
						<Logout />
					</button>
				</a>
				<DashbArtLeft className="dashboard-art-left" />
				<DashbArtRight className="dashboard-art-right" />
			</div>
		);
	}
}
