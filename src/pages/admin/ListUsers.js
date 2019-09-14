import React, { Component } from "react";
import axios from "axios";
import { Transition, animated } from "react-spring/renderprops";
import * as easings from "d3-ease";

import Header from "../components/Header";
import UserCard from "./UserCard";

import { ReactComponent as ArtUsers } from "../../assets/songs.svg";
import { ReactComponent as ArrowDown } from "../../assets/angle-down-solid.svg";
import { ReactComponent as Notch } from "../../assets/circle-notch-solid.svg";

import "../../css/admin-css/users.scss";

export default class ListUsers extends Component {
	state = {
		bannedUsers: [],
		users: [],
		initSwitch: true
	};
	componentDidMount() {
		let urlNormal = "/api/users/?mode=normal";
		let urlBanned = "/api/users/?mode=blocked";
		axios.get(urlNormal).then((res) => this.setState({ users: res.data }));
		axios
			.get(urlBanned)
			.then((res) => this.setState({ bannedUsers: res.data }));
	}
	initSwitch = (dir) => {
		if (dir === "left") {
			this.setState({ initSwitch: false });
		} else if (dir === "right") {
			this.setState({ initSwitch: true });
		}
	};
	render() {
		let isMobile = false;
		if (window.screen.width <= 900) {
			isMobile = true;
		}
		const { users, bannedUsers } = this.state;
		return (
			<div>
				{isMobile ? <Header kolcsey={false} /> : <Header kolcsey={true} />}
				<Transition
					native
					items={this.state.initSwitch}
					from={{
						position: "absolute",
						top: "52%",
						left: "-50%",
						transform: "translate(-50%, -50%)"
					}}
					enter={{ left: "50%" }}
					leave={{ left: "-50%" }}
					config={{ duration: 1000, easing: easings.easeCubicInOut }}
				>
					{(show) =>
						show &&
						((props) => (
							<animated.div style={props}>
								<div id="userban-wrapper">
									<div className="userban-wrapper__list">
										{users.map((user) => {
											return <UserCard key={user.userid} user={user} />;
										})}
									</div>
								</div>
							</animated.div>
						))
					}
				</Transition>
				<Transition
					native
					items={this.state.initSwitch}
					from={{
						position: "absolute",
						right: "100%",
						top: "50%",
						transform: "translate(-50%, -50%)"
					}}
					enter={{ right: "0%" }}
					leave={{ right: "100%" }}
					config={{ duration: 1000, easing: easings.easeCubicInOut }}
				>
					{(show) =>
						show &&
						((props) => (
							<animated.div style={props}>
								<div id="users-pagination">
									<div
										className="usr-ico-wrapper"
										onClick={this.initSwitch.bind(this, "left")}
									>
										<Notch className="usr-ico pagination-notch" />
										<ArrowDown className="usr-ico pagination-arrow-down" />
									</div>
									<h2>Banned Users</h2>
								</div>
							</animated.div>
						))
					}
				</Transition>
				<Transition
					native
					items={!this.state.initSwitch}
					from={{
						position: "absolute",
						left: "125%",
						top: "50%",
						transform: "translate(-50%, -50%)"
					}}
					enter={{ left: "25%" }}
					leave={{ left: "125%" }}
					config={{ duration: 1000, easing: easings.easeCubicInOut }}
				>
					{(show) =>
						show &&
						((props) => (
							<animated.div style={props}>
								<div id="users-pagination__unban">
									<div
										className="usr-ico-wrapper"
										onClick={this.initSwitch.bind(this, "right")}
									>
										<Notch className="usr-ico pagination-notch" />
										<ArrowDown className="usr-ico pagination-arrow-down" />
									</div>
									<h2>Normal Users</h2>
								</div>
							</animated.div>
						))
					}
				</Transition>
				<Transition
					native
					items={!this.state.initSwitch}
					from={{
						position: "absolute",
						left: "150%",
						top: "50%",
						transform: "translate(-50%, -50%)"
					}}
					enter={{ left: "50%" }}
					leave={{ left: "150%" }}
					config={{ duration: 1000, easing: easings.easeCubicInOut }}
				>
					{(show) =>
						show &&
						((props) => (
							<animated.div style={props}>
								<div id="userban-wrapper__banned">
									<div className="userban-wrapper__list">
										{bannedUsers.map((user) => {
											return (
												<UserCard
													key={user.userid}
													user={user}
													isUnban={true}
												/>
											);
										})}
									</div>
								</div>
							</animated.div>
						))
					}
				</Transition>
				<ArtUsers className="art-users" />
			</div>
		);
	}
}
