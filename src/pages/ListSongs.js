import React, { Component } from "react";
import axios from "axios";

import "../css/songlist.css";

import Header from "./components/Header";
import SongListPage from "./components/SongListPage";
import UpcomingCard from "./components/UpcomingCard";
import Indicator from "./components/SongListPaginationIndicator";

import { ReactComponent as ArrowUp } from "../assets/angle-up-solid.svg";
import { ReactComponent as ArrowDown } from "../assets/angle-down-solid.svg";

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

		const handleUpperClick = () => {
			if (this.state.currentPage !== 0) {
				this.setState({ currentPage: currentPage - 1 });
			} else {
			}
		};
		const handleBottomClick = () => {
			if (this.state.currentPage !== sl_Round - 1) {
				this.setState({ currentPage: currentPage + 1 });
			} else {
			}
		};

		let songPages = [];
		for (let i = 0; i < sl_Round; i++) {
			if (i === 0) {
				songPages.push(<SongListPage key={i} id={i} isFirstPage={true} />);
			}
			if (i !== 0) {
				songPages.push(<SongListPage key={i + 1} id={i} isFirstPage={false} />);
			}
		}
		let isFirstPage = false,
			isLastPage = false;
		if (currentPage === 0) {
			isFirstPage = true;
		} else if (currentPage === sl_Round - 1) {
			isLastPage = true;
		}
		let songCardWrapperStyle, songsWrapperStyle, songListWrapperStyle;
		if (isFirstPage) {
			songCardWrapperStyle = { marginTop: "120px" };
			songsWrapperStyle = { height: "550px" };
			songListWrapperStyle = { height: "360px", top: "53%" };
		} else {
			songCardWrapperStyle = { marginTop: "0" };
			songsWrapperStyle = { height: "500px" };
			songListWrapperStyle = { height: "240px", top: "49%" };
		}

		let ArrowUpStyle, ArrowDownStyle;
		if (isFirstPage) {
			ArrowUpStyle = { color: "#D2D2D2", cursor: "default" };
		} else if (isLastPage) {
			ArrowDownStyle = { color: "#D2D2D2", cursor: "default" };
		}
		return (
			<React.Fragment>
				<Header kolcsey={false} />
				<div className="songs-wrapper" style={songsWrapperStyle}>
					<h1 className="songs-wrapper-heading">
						Eddig hozzáadott <span>zenék</span>
					</h1>
					<div className="list-wrapper" style={songListWrapperStyle}>
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
					<ArrowUp
						className={
							isFirstPage
								? "songs-arrow songs-arrow-up"
								: "songs-arrow songs-arrow-up hvr-grow"
						}
						style={ArrowUpStyle}
						onClick={handleUpperClick}
					/>
					<Indicator currentPage={currentPage + 1} lastPage={sl_Round} />
					<ArrowDown
						className={
							isLastPage
								? "songs-arrow songs-arrow-down"
								: "songs-arrow songs-arrow-down hvr-grow"
						}
						style={ArrowDownStyle}
						onClick={handleBottomClick}
					/>
				</div>
			</React.Fragment>
		);
	}
}
