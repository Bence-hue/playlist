import React, { Component } from "react";

import Header from "./components/Header";
import "../css/songlist.css";

import SongCard from "./components/SongCard";
import UpcomingCard from "./components/UpcomingCard";

export default class ListSongs extends Component {
	state = {
		songs: [
			{
				id: 4,
				title: "Ain't no rest for the wicked",
				artist: "Cage the elephant",
				yttitle: "Alan walker - faded (Offical video)",
				link: "www.youtube.com",
				user: "",
				createdAt: "2019.07.21",
				played: false,
				playedAt: ""
			},
			{
				id: 8,
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
		const smallestId = Math.min(...getIds());
		console.log(smallestId);

		const otherSongs = songs.filter(sg => {
			return sg.id !== smallestId;
		});
		const upcomingSong = songs.filter(sg => {
			return sg.id === smallestId;
		});
		console.log(upcomingSong);

		return (
			<React.Fragment>
				<Header kolcsey={false} />
				<div className="songs-wrapper">
					<h1 className="songs-wrapper-heading">
						Eddig hozzáadott <span>zenék</span>
					</h1>
					<div className="list-wrapper">
						{upcomingSong.map(sg => {
							return <UpcomingCard key={sg.id} song={sg} />;
						})}
						<div className="song-card-wrapper">
							{otherSongs.map(sg => {
								return <SongCard key={sg.id} song={sg} isAdmin={false} />;
							})}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
