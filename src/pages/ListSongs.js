import React, { Component } from "react";
import axios from "axios";

import Header from "./components/Header";
import "../css/songlist.css";

import SongCard from "./components/SongCard";
import UpcomingCard from "./components/UpcomingCard";

export default class ListSongs extends Component {
	state = {
		songs: [
			{
				id: 4,
				title: "Holder",
				artist: "Place"
			},
			{
				id: 8,
				title: "Holder",
				artist: "Place"
			},
			{
				id: 10,
				title: "Holder",
				artist: "Place"
			}
		]
	};

	componentDidMount() {
		let url = "http://46.107.123.236:8000/api/list/?mode=unplayed";
		axios.get(url).then(res => this.setState({ songs: res.data }));
	}

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
								return <SongCard key={sg.id} song={sg} />;
							})}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
