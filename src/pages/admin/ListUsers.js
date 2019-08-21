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
		users: [],
		initSwitch: true
	};
	componentDidMount() {
		let url = "/api/users/?mode=normal";
		axios.get(url).then((res) => this.setState({ users: res.data }));
	}
	initSwitch = (dir) => {
		if (dir === "left") {
			this.setState({ initSwitch: false });
		}
	};
	render() {
		const { users } = this.state;
		return (
			<div>
				<Header kolcsey={true} />
				<Transition
					native
					items={this.state.initSwitch}
					from={{
						position: "absolute",
						left: "0%",
						top: "50%",
						transform: "translate(-50%, -50%)"
					}}
					enter={{ left: "50%" }}
					leave={{ left: "-30%" }}
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
				<ArtUsers className="art-users" />
			</div>
		);
	}
}
