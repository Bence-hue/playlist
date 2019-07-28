import React, { Component } from "react";

import Header from "./components/Header";
import "../css/songlist.css";

export default class ListSongs extends Component {
	state = {
		songs: [
			{
				id: "1",
				title: "Faded",
				artist: "Alan Walker",
				yttitle: "Alan walker - faded (Offical video)",
				link: "www.youtube.com",
				user: "",
				createdAt: "2019.07.21",
				played: false,
				playedAt: ""
			},
			{
				id: "2",
				title: "Hétköznapi Hősök",
				artist: "Punnany Massif",
				yttitle: "Punnany - Hétköznapi hősök",
				link: "www.youtube.com",
				user: "",
				createdAt: "2019.07.28",
				played: false,
				playedAt: ""
			}
		]
	};

	render() {
		const { songs } = this.state;
		const getIds = () => {
			return songs.map(d => d.id);
		};
		const smallestId = () => {
			return Math.min(...getIds());
		};
		console.log(smallestId());
		return (
			<React.Fragment>
				<Header kolcsey={false} />
				<div className="songs-wrapper">
					<h1>
						Eddig hozzáadott <span>zenék</span>
					</h1>
					<div className="list-wrapper">
						<div className="asd" />
					</div>
				</div>
			</React.Fragment>
		);
	}
}
