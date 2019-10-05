import React, { Component } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

import { ReactComponent as Check } from "../../assets/check-solid.svg";
import { ReactComponent as Times } from "../../assets/times-solid.svg";
import { ReactComponent as Playcheck } from "../../assets/spotify-playcheck.svg";

import "../../css/songlist.css";

export default class UpcomingCard extends Component {
	state = {
		playckheck: false
	};
	componentDidMount() {
		axios.get("/api/spotify/status/").then((res) => {
			if (JSON.parse(res.data.toLowerCase()) === true) {
				axios.get("/api/spotify/devices/").then((res) => {
					if (JSON.parse(res.data.isAnySelected) === true) {
						if (this.props.song.spotilink !== "") {
							this.setState({ playcheck: true });
						}
					}
				});
			}
		});
	}
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
	handleSpotiPlay = () => {
		let url = "/api/play/",
			params = new URLSearchParams();
		params.append("id", this.props.song.spotiuri);
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios
			.post(url, params)
			.then(() => window.location.reload())
			.catch((e) => console.log(e));
	};
	render() {
		const {
			title,
			artist,
			yttitle,
			link,
			spotititle,
			spotilink
		} = this.props.song;
		const { playcheck } = this.state;
		return (
			<div className="upcoming-card upcoming-card-admin">
				<h2>most következik:</h2>
				<h1>{artist}</h1>
				<span />
				<h1>{title}</h1>
				<div className="upc-yt-wrapper">
					<p>
						<i className="fab fa-youtube" />
						<i className="fas fa-circle" />{" "}
						<a href={link} target="_blank" rel="noopener noreferrer">
							{ReactHtmlParser(yttitle)}
						</a>
					</p>
					<p>
						<i className="fab fa-spotify"></i>
						<a href={spotilink} target="_blank" rel="noopener noreferrer">
							{spotititle}
						</a>
					</p>
				</div>
				<div className="upc-control-wrapper">
					{playcheck ? (
						<Playcheck
							className="upc-icons spoti-playcheck"
							onClick={this.handleSpotiPlay}
						/>
					) : null}
					<Check className="upc-icons" onClick={this.handlePlayed} />
					<Times className="upc-icons" onClick={this.handleDelete} />
				</div>
			</div>
		);
	}
}
