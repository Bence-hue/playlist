import React, { Component } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

import { ReactComponent as Check } from "../../assets/check-solid.svg";
import { ReactComponent as Times } from "../../assets/times-solid.svg";

import "../../css/songlist.css";

export default class UpcomingCard extends Component {
	handlePlayed = () => {
		let url = "/api/played/";
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
	render() {
		const { title, artist, yttitle, link } = this.props.song;
		return (
			<div className="upcoming-card upcoming-card-admin">
				<h2>most következik:</h2>
				<h1>{artist}</h1>
				<span />
				<h1>{title}</h1>
				<div className="upc-yt-wrapper">
					<i className="fab fa-youtube" />
					<i className="fas fa-circle" />{" "}
					<a href={link} target="_blank" rel="noopener noreferrer">
						{ReactHtmlParser(yttitle)}
					</a>
				</div>
				<div className="upc-control-wrapper">
					<Check className="upc-icons" onClick={this.handlePlayed} />
					<Times className="upc-icons" onClick={this.handleDelete} />
				</div>
			</div>
		);
	}
}
