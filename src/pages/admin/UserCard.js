import React, { Component } from "react";

import { ReactComponent as Dots } from "../../assets/ellipsis-h-solid.svg";
import { ReactComponent as ArrowDown } from "../../assets/angle-down-solid.svg";

import "../../css/admin-css/songs.scss";

export default class UserCard extends Component {
	state = {
		banMenu: false,
		collapsed: true
	};

	toggleCollapse = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};
	toggleBanMenu = () => {
		this.setState({ banMenu: !this.state.banMenu });
	};
	render() {
		const { user } = this.props;
		const { banMenu, collapsed } = this.state;
		let styleCard, styleBan;
		if (collapsed) {
			styleCard = {
				display: "none"
			};
		} else {
			styleCard = {
				display: "block"
			};
		}

		if (banMenu) {
			styleBan = { display: "block" };
		} else {
			styleBan = { display: "none" };
		}

		return (
			<div className="usc">
				<Dots className="usc-dots" onClick={this.toggleCollapse} />
				<h3 style={styleCard}>Userid: {user.userid}</h3>
				<h2 style={styleCard}>Beküldött zenék:</h2>
				<div className="usc__songs" style={styleCard}>
					{user.songs.map((sg) => {
						return (
							<div className="user-song-card">
								<h1>
									{sg.artist} <span /> {sg.title}
								</h1>
							</div>
						);
					})}
				</div>
				<button id="ban" onClick={this.toggleBanMenu}>
					BAN
				</button>
				<div className="usc_ban-menu" style={styleBan}>
					<ul>
						<li>
							<p>1 hét</p>
						</li>
						<li>
							<p>1 hónap</p>
						</li>
						<li>
							<p>3 hónap</p>
						</li>
					</ul>
				</div>
				<ArrowDown className="usc-arrow" />
			</div>
		);
	}
}
