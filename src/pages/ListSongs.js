import React, { Component } from "react";
import axios from "axios";

import Header from "./components/Header";
import "../css/songlist.css";

import SongListPage from "./components/SongListPage";
import UpcomingCard from "./components/UpcomingCard";

export default class ListSongs extends Component {
	state = {
		songs: [],
		currentPage: 0
	};

	componentDidMount() {
		let url = "http://bnctth.ml:8000/api/list/?mode=unplayed";
		axios.get(url).then(res => this.setState({ songs: res.data }));
	}

	render() {
		const { songs, currentPage } = this.state;
		const getIds = () => {
			return songs.map(d => d.id);
		};
		const smallestId = Math.min(...getIds());

		const upcomingSong = songs.filter(sg => {
			return sg.id === smallestId;
		});
		const sl_Round = Math.ceil(songs.length / 5);

		let songPages = [];
		for (let i = 0; i < sl_Round; i++) {
			if (i === 0) {
				songPages.push(<SongListPage key={i} id={i} isFirstPage={true} />);
			}
			if (i !== 0) {
				songPages.push(<SongListPage key={i + 1} id={i} isFirstPage={false} />);
			}
		}
		let songCardWrapperStyle;
		if (currentPage === 0) {
			songCardWrapperStyle = { marginTop: "120px" };
		} else {
			songCardWrapperStyle = { marginTop: "0" };
		}

		return (
			<React.Fragment>
				<Header kolcsey={false} />
				<div className="songs-wrapper">
					<h1 className="songs-wrapper-heading">
						Eddig hozzáadott <span>zenék</span>
					</h1>
					<div className="list-wrapper">
						{upcomingSong.map(sg => {
							if (currentPage === 0) {
								return <UpcomingCard key={sg.id} song={sg} />;
							}
							return null;
						})}
						<div className="song-card-wrapper" style={songCardWrapperStyle}>
							{songPages[currentPage]}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
