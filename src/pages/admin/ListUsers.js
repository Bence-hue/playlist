import React, { Component } from "react";
import axios from "axios";

import Header from "../components/Header";
import UserCard from "./UserCard";

import { ReactComponent as ArtSongs } from "../../assets/songs.svg";

import "../../css/admin-css/songs.scss";

export default class ListUsers extends Component {
	state = {
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
		]
	};
	componentDidMount() {
		let url = "http://playlist.jelszo.co:8000/api/users/";
		axios.get(url).then((res) => this.setState({ users: res.data }));
	}
	render() {
		const { users } = this.state;
		return (
			<div>
				<Header kolcsey={true} />
				<div id="userban-wrapper">
					<div className="userban-wrapper__list">
						{users.map((user) => {
							return <UserCard user={user} />;
						})}
					</div>
				</div>
				<ArtSongs className="art-songs" />
			</div>
		);
	}
}
