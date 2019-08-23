import React, { Component } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

import "../../css/songlist.css";

import { ReactComponent as PrevArrow } from "../../assets/angle-down-solid.svg";
import { ReactComponent as NextArrow } from "../../assets/angle-up-solid.svg";
import { ReactComponent as Check } from "../../assets/check-solid.svg";
import { ReactComponent as Times } from "../../assets/times-solid.svg";
import { ReactComponent as Dots } from "../../assets/ellipsis-h-solid.svg";

export default class SongCardAdmin extends Component {
	state = {
		collapsed: true,
		sessionid: ""
	};
	handlePlayed = () => {
		let url = "/api/played/";
		let params = new URLSearchParams();
		params.append("id", this.props.song.id);
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios
			.request({
				url,
				method: "post",
				data: params
			})
			.then((res) => {
				window.location.reload();
			})
			.catch((err) => {
				console.error(err);
			});
	};
	handleDelete = () => {
		let url = "/api/delete/";
		let params = new URLSearchParams();
		params.append("id", this.props.song.id);
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios
			.post(url, params)
			.then((res) => {
				window.location.reload();
			})
			.catch((err) => {
				console.error(err.response.status);
			});
	};
	toggleCollapse = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};
	render() {
		const {
			isMobile,
			isNextArrow,
			isPrevArrow,
			handlePrevClick,
			handleNextClick
		} = this.props;
		console.log(isMobile);

		const { id } = this.props;
		const { collapsed } = this.state;
		const zIndex = {
			zIndex: id * -1
		};
		let songCard, songCardMove, songCardYt;
		if (collapsed) {
			songCard = { height: "60px" };
			songCardMove = { top: "50%" };
			songCardYt = { opacity: "0", display: "none" };
		} else {
			songCard = { height: "120px" };
			songCardMove = { top: "25%" };
			songCardYt = { display: "block", opacity: "1" };
		}
		if (isNextArrow) {
			return (
				<div className="song-card song-card__arrow" onClick={handleNextClick}>
					<h1>Következő oldal</h1>
					<NextArrow className="song-card__arrow-component song-card__arrow-next" />
				</div>
			);
		} else if (isPrevArrow) {
			return (
				<div className="song-card song-card__arrow" onClick={handlePrevClick}>
					<PrevArrow className="song-card__arrow-component song_card__arrow-prev" />
					<h1>Előző oldal</h1>
				</div>
			);
		} else {
			const { title, artist, yttitle, link } = this.props.song;
			return (
				<div className="song-card song-card-admin" style={(zIndex, songCard)}>
					<h1 style={songCardMove}>{artist}</h1>
					<span style={songCardMove} />
					<h1 style={songCardMove}>{title}</h1>
					<div
						className="sc-control-wrapper"
						style={isMobile ? songCardYt : {}}
					>
						<Check className="sc-icons sc-check" onClick={this.handlePlayed} />
						<Times className="sc-icons sc-times" onClick={this.handleDelete} />
					</div>
					<Dots
						className="dots"
						onClick={this.toggleCollapse}
						style={
							(songCardMove,
							isMobile ? { transform: "translateY(-50%) rotate(90deg)" } : {})
						}
					/>
					<div className="sc-yt-wrapper" style={songCardYt}>
						<i className="fab fa-youtube" />{" "}
						<a href={link} target="_blank" rel="noopener noreferrer">
							{ReactHtmlParser(yttitle)}
						</a>
					</div>
				</div>
			);
		}
	}
}
