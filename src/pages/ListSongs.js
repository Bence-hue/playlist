import React, { Component } from "react";
import axios from "axios";
import { Breakpoint } from "react-socks";

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
		currentPage: 0,
		currentPageMobile: 0
	};

	componentDidMount() {
		let url = "https://playlist.jelszo.co/api/list/?mode=unplayed";
		axios.get(url).then(res => this.setState({ songs: res.data }));
	}

	render() {
		const { songs, currentPage, currentPageMobile } = this.state;

		// Get smallest id of received songs + return upcoming song
		const getIds = () => {
			return songs.map(d => d.id);
		};
		const smallestId = Math.min(...getIds());
		const upcomingSong = songs.filter(sg => {
			return sg.id === smallestId;
		});

		// Count pages
		const sl_Round = Math.ceil(songs.length / 5);
		const sl_Round_Mobile = Math.ceil(songs.length / 25);

		// Handle desktop pagination clicks
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

		// Handle mobile pagination links
		const handleMobilePrevClick = () => {
			console.log("next-click");
			if (this.state.currentPageMobile !== 0) {
				this.setState({ currentPageMobile: currentPageMobile - 1 });
			} else {
			}
		};
		const handleMobileNextClick = () => {
			console.log("prev-click");
			if (this.state.currentPageMobile !== sl_Round_Mobile - 1) {
				this.setState({ currentPageMobile: currentPageMobile + 1 });
			} else {
			}
		};

		// Desktop pages
		let songPages = [];
		for (let i = 0; i < sl_Round; i++) {
			if (i === 0) {
				songPages.push(<SongListPage key={i} id={i} isFirstPage={true} />);
			}
			if (i !== 0) {
				songPages.push(<SongListPage key={i + 1} id={i} isFirstPage={false} />);
			}
		}

		// Detect first and last page on mobile
		let isLastPageMobile = false;
		if (currentPageMobile === sl_Round_Mobile - 1) {
			isLastPageMobile = true;
		}

		// Mobile pages
		let songPagesMobile = [];
		for (let i = 0; i < 2; i++) {
			if (i === 0) {
				songPagesMobile.push(
					// prettier-ignore
					<SongListPage key={i} id={i} isFirstPage={true} isMobile={true} isLastPageMobile={isLastPageMobile} handleNextClick={handleMobileNextClick}/>
				);
			}
			if (i !== 0) {
				songPagesMobile.push(
					// prettier-ignore
					<SongListPage key={i + 1} id={i} isFirstPage={false} isMobile={true} isLastPageMobile={isLastPageMobile} handleNextClick={handleMobileNextClick} handlePrevClick={handleMobilePrevClick}/>
				);
			}
		}

		// detect firstPage on desktop
		let isFirstPage = false,
			isLastPage = false;
		if (currentPage === 0) {
			isFirstPage = true;
		} else if (currentPage === sl_Round - 1) {
			isLastPage = true;
		}

		// style desktop pages based on firstPage
		let songCardWrapperStyle, songsWrapperStyle, songListWrapperStyle;
		let mobileSongCardWrapperStyle;
		if (isFirstPage) {
			// First page on desktop
			songCardWrapperStyle = { marginTop: "120px" };
			songsWrapperStyle = { height: "550px" };
			songListWrapperStyle = { height: "360px", top: "53%" };
			} else {
			// Other pages on desktop
			songCardWrapperStyle = { marginTop: "0" };
			songsWrapperStyle = { height: "500px" };
			songListWrapperStyle = { height: "240px", top: "49%" };
			}

		// detect firstPage on mobile
		let isFirstPageMobile = false;
	if (currentPageMobile === 0) {
		isFirstPageMobile = true; }
		if (isFirstPageMobile) {
// First page on mobile
mobileSongCardWrapperStyle = { marginTop: "100px" }
		
		} else {
// Other pages on mobile
mobileSongCardWrapperStyle = { marginTop: "0" }
		
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
				<Breakpoint tabletl up>
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
				</Breakpoint>

				{/* Mobile DOM */}
				<Breakpoint tabletp down>
					<h1 className="songs-wrapper-heading">
						Eddig hozzáadott <span>zenék</span>
					</h1>
					<div className="songs-wrapper">
						<div className="list-wrapper">
							{upcomingSong.map(sg => {
								if (currentPageMobile === 0) {
									return <UpcomingCard key={sg.id} song={sg} />;
								}
								return null;
							})}
							<div className="song-card-wrapper" style={mobileSongCardWrapperStyle}>
								{songPagesMobile[currentPageMobile]}
							</div>
						</div>
					</div>
				</Breakpoint>
			</React.Fragment>
		);
	}
}
