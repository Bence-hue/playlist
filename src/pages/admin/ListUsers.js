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
		users: [
			{
				userid: "ea9ed4df-af36-43c3-b813-5a932a98ddd7",
				isBlocked: true,
				songs: [
					{ artist: "ccc", title: "ddd" },
					{ artist: "aaa", title: "bbb" }
				]
			},
			{
				userid: "55cdcb27-bb48-433e-9f01-02a58e59f85c",
				isBlocked: false,
				songs: [{ artist: "time", title: "limit 1" }]
			},
			{
				userid: "506e293e-42a6-4d43-90ee-ca8c57283a2b",
				isBlocked: false,
				songs: [{ artist: "oof", title: "foo" }]
			},
			{
				userid: "718d3084-f37d-4f88-9476-ae3c2879dff0",
				isBlocked: false,
				songs: [{ artist: "KURVA ANY\u00c1D", title: "BAZDMEG" }]
			},
			{
				userid: "d36d4784-aabf-4e9e-9304-78279f933c2c",
				isBlocked: false,
				songs: [
					{ artist: "Notar Mary", title: "Hullnak a falevelek" },
					{ artist: "queen", title: "bohemian rhapsody" },
					{
						artist: "Ben Slimenenn\u00e9",
						title: "Czipa Bogl\u00e1rka Piroska"
					}
				]
			},
			{
				userid: "46481078-b61a-459c-a6f2-59e4ea519dec",
				isBlocked: false,
				songs: [
					{ artist: "barns courtney", title: "glitter & gold" },
					{ artist: "aaa", title: "bbb" }
				]
			},
			{
				userid: "c8f16ee8-38e9-41ff-842b-16bd5ad27789",
				isBlocked: false,
				songs: [{ artist: "we are fury", title: "demons" }]
			},
			{
				userid: "10468b95-70ea-49fd-ad2d-4a2a2d5cdfec",
				isBlocked: false,
				songs: [
					{ artist: "we are fury", title: "rise" },
					{ artist: "fall out boy", title: "centuries" },
					{ artist: "caravan palace", title: "miracle" },
					{ artist: "onerepublic", title: "heaven" },
					{ artist: "alan walker", title: "all falls down" },
					{ artist: "alan walker", title: "darkside" }
				]
			},
			{
				userid: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
				isBlocked: false,
				songs: [
					{ artist: "alan walker", title: "on my way" },
					{ artist: "alan walker", title: "faded" },
					{ artist: "alan walker", title: "alone" },
					{ artist: "thefatrat", title: "chosen" }
				]
			}
		],
		initSwitch: true
	};
	componentDidMount() {
		let urlNormal = "http://playlist.jelszo.co:8000/api/users/?mode=normal";
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
						left: "50%",
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
								<div id="userban-wrapper">
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
