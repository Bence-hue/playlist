import React, { Component } from "react";
import axios from "axios";
import { Breakpoint } from "react-socks";

import "../../css/songlist.css";

import Header from "../components/Header";
import SongListPageAdmin from "./SongListPageAdmin";
import UpcomingCardAdmin from "./UpcomingCardAdmin";
import Indicator from "../components/SongListPaginationIndicator";

import { ReactComponent as ArrowUp } from "../../assets/angle-up-solid.svg";
import { ReactComponent as ArrowDown } from "../../assets/angle-down-solid.svg";

export default class ListSongsAdmin extends Component {
	state = {
		songs: [],
		currentPage: 0,
		currentPageMobile: 0
	};

	componentDidMount() {
		let url = "/api/list/?mode=unplayed";
		axios
			.get(url)
			.then((res) => this.setState({ songs: res.data }))
			.catch((err) => {
				console.error(err);
			});
		console.log(this.state);
	}

	render() {
		const { songs, currentPage, currentPageMobile } = this.state;

		let noData;
		if (songs.length === 0) {
			noData = true;
		} else {
			noData = false;
		}

		// Get smallest id of received songs + return upcoming song
		const getIds = () => {
			return songs.map((d) => d.id);
		};
		const smallestId = Math.min(...getIds());
		const upcomingSong = songs.filter((sg) => {
			return sg.id === smallestId;
		});

		// Count pages
		const SlRound = Math.ceil(songs.length / 5);
		const SlRoundMobile = Math.ceil(songs.length / 25);

		// Handle desktop pagination clicks
		const handleUpperClick = () => {
			if (noData) {
			} else {
				if (this.state.currentPage !== 0) {
					this.setState({ currentPage: currentPage - 1 });
				} else {
				}
			}
		};
		const handleBottomClick = () => {
			if (!noData) {
				if (this.state.currentPage !== SlRound - 1) {
					this.setState({ currentPage: currentPage + 1 });
				}
			}
		};

		// Handle wheel events
		const handleWheel = (e) => {
			if (e.deltaY < 0) {
				// Scroll up
				handleUpperClick();
			} else {
				// Scroll down
				handleBottomClick();
			}
		};

		// Handle mobile pagination links
		const handleMobilePrevClick = () => {
			if (this.state.currentPageMobile !== 0) {
				this.setState({ currentPageMobile: currentPageMobile - 1 });
			}
		};
		const handleMobileNextClick = () => {
			if (this.state.currentPageMobile !== SlRoundMobile - 1) {
				this.setState({ currentPageMobile: currentPageMobile + 1 });
				window.scrollTo(0, 0);
			}
		};

		// Desktop pages
		let songPages = [];
		for (let i = 0; i < SlRound; i++) {
			if (i === 0) {
				songPages.push(<SongListPageAdmin key={i} id={i} songs={songs} isFirstPage={true} />);
			}
			if (i !== 0) {
				songPages.push(<SongListPageAdmin key={i + 1} id={i} songs={songs} isFirstPage={false} />);
			}
		}

		// Detect first and last page on mobile
		let isLastPageMobile = false;
		if (currentPageMobile === SlRoundMobile - 1) {
			isLastPageMobile = true;
		}

		// Mobile pages
		let songPagesMobile = [];
		for (let i = 0; i < SlRoundMobile; i++) {
			if (i === 0) {
				songPagesMobile.push(
					<SongListPageAdmin
						key={i}
						id={i}
						isFirstPage={true}
						isMobile={true}
						isLastPageMobile={isLastPageMobile}
						handleNextClick={handleMobileNextClick}
						songs={songs}
					/>
				);
			}
			if (i !== 0) {
				songPagesMobile.push(
					<SongListPageAdmin
						key={i + 1}
						id={i}
						isFirstPage={false}
						isMobile={true}
						isLastPageMobile={isLastPageMobile}
						handleNextClick={handleMobileNextClick}
						handlePrevClick={handleMobilePrevClick}
						songs={songs}
					/>
				);
			}
		}

		// detect firstPage on desktop
		let isFirstPage = false,
			isLastPage = false;
		if (currentPage === 0) {
			isFirstPage = true;
		} else if (currentPage === SlRound - 1) {
			isLastPage = true;
		}

		// style desktop pages based on firstPage
		let songCardWrapperStyle, songsWrapperStyle, songListWrapperStyle;
		let mobileSongCardWrapperStyle;
		if (isFirstPage) {
			// First page on desktop
			songCardWrapperStyle = { marginTop: "150px" };
			songsWrapperStyle = {
				height: "550px",
				width: "1100px",
				maxWidth: "2000px"
			};
			songListWrapperStyle = { height: "360px", top: "53%" };
		} else {
			// Other pages on desktop
			songCardWrapperStyle = { marginTop: "0" };
			songsWrapperStyle = {
				height: "500px",
				width: "1100px",
				maxWidth: "2000px"
			};
			songListWrapperStyle = { height: "240px", top: "49%" };
		}

		// detect firstPage on mobile
		let isFirstPageMobile = false;
		if (currentPageMobile === 0) {
			isFirstPageMobile = true;
		}
		if (isFirstPageMobile) {
			// First page on mobile
			mobileSongCardWrapperStyle = { marginTop: "120px" };
		} else {
			// Other pages on mobile
			mobileSongCardWrapperStyle = { marginTop: "0" };
		}

		// Desktop arrow styles
		let ArrowUpStyle, ArrowDownStyle;
		if (noData) {
			ArrowDownStyle = { color: "#D2D2D2", cursor: "default" };
			ArrowUpStyle = { color: "#D2D2D2", cursor: "default" };
		} else {
			if (isFirstPage) {
				ArrowUpStyle = { color: "#D2D2D2", cursor: "default" };
			} else if (isLastPage) {
				ArrowDownStyle = { color: "#D2D2D2", cursor: "default" };
			}
		}
		return (
			<React.Fragment>
				<Header kolcsey={false} />
				<Breakpoint tabletl up>
					<div
						className="songs-wrapper songs-wrapper-admin"
						style={songsWrapperStyle}
						onWheel={handleWheel}
					>
						<h1 className="songs-wrapper-heading">
							Eddig hozzáadott <span>zenék</span>
						</h1>
						<div className="list-wrapper" style={songListWrapperStyle}>
							{upcomingSong.map((sg) => {
								if (currentPage === 0) {
									return <UpcomingCardAdmin key={sg.id} song={sg} />;
								}
								return null;
							})}
							<div className="song-card-wrapper" style={songCardWrapperStyle}>
								{songPages[currentPage]}
							</div>
						</div>
						<ArrowUp
							className={
								noData
									? "songs-arrow songs-arrow-up"
									: isFirstPage
									? "songs-arrow songs-arrow-up"
									: "songs-arrow songs-arrow-up hvr-grow"
							}
							style={ArrowUpStyle}
							onClick={handleUpperClick}
						/>
						<Indicator currentPage={noData ? currentPage : currentPage + 1} lastPage={SlRound} />
						<ArrowDown
							className={
								noData
									? "songs-arrow songs-arrow-down"
									: isLastPage
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
							{upcomingSong.map((sg) => {
								if (currentPageMobile === 0) {
									return <UpcomingCardAdmin key={sg.id} song={sg} />;
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
