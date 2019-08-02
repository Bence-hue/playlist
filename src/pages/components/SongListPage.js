import React, { Component } from "react";
import axios from "axios";

import SongCard from "./SongCard";

export default class SongListPage extends Component {
	state = {
		songs: []
	};

	componentDidMount() {
		let url = "https://playlist.jelszo.co/api/list/?mode=unplayed";
		axios.get(url).then(res => this.setState({ songs: res.data }));
	}
	render() {
		const { songs } = this.state;
		const getIds = () => {
			return songs.map(d => d.id);
		};
		const smallestId = Math.min(...getIds());

		const otherSongs = songs.filter(sg => {
			return sg.id !== smallestId;
		});

		let sliceStart, sliceStop;
		if (this.props.isFirstPage) {
			sliceStart = this.props.id * 5;
			sliceStop = this.props.id * 5 + 4;
		} else {
			sliceStart = this.props.id * 5 - 1;
			sliceStop = this.props.id * 5 + 4;
		}

		return (
			<div>
				{/* <h1>{`${sliceStart} ${sliceStop}`}</h1> */}
				{otherSongs.slice(sliceStart, sliceStop).map(sg => {
					return <SongCard key={sg.id} song={sg} />;
				})}
			</div>
		);
	}
}
