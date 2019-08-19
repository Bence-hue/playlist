import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";

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
		let url = "http://playlist.jelszo.co:8000/api/played/";
		let params =
			// {
			// 	id: this.props.song.id,
			// 	token: "ffhPRx4Aql5G7jOCNxZDw6ZjMnD4BdWR"
			// };
			new URLSearchParams();
		params.append("id", this.props.song.id);
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios
			.request({
				url: url,
				method: "post",
				data: params
				// headers: { Cookie: `sessionid=${cookie.load("sessionid")}` }
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
		params.append("token", "ffhPRx4Aql5G7jOCNxZDw6ZjMnD4BdWR");
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios
			.post(url, params)
			.then((res) => {
				window.location.reload();
			})
			.catch((err) => {
				console.error(err);
			});
	};
	toggleCollapse = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};
	render() {
		const {
			isNextArrow,
			isPrevArrow,
			handlePrevClick,
			handleNextClick
		} = this.props;
		const { id } = this.props;
		const { collapsed } = this.state;
		const zIndex = {
			zIndex: id * -1
		};
		let songCardStyle;
		if (collapsed) {
			songCardStyle = { height: "60px" };
		} else {
			songCardStyle = { height: "120px" };
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
			const { title, artist } = this.props.song;
			return (
				<div
					className="song-card song-card-admin"
					style={(zIndex, songCardStyle)}
				>
					<h1>{artist}</h1>
					<span />
					<h1>{title}</h1>
					<div className="sc-control-wrapper">
						<Check className="sc-icons sc-check" onClick={this.handlePlayed} />
						<Times className="sc-icons sc-times" onClick={this.handleDelete} />
					</div>
					<Dots className="dots" onClick={this.toggleCollapse} />
				</div>
			);
		}
	}
}
