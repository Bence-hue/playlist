import React, { Component } from "react";

import "../../css/songlist.css";

import { ReactComponent as PrevArrow } from "../../assets/angle-down-solid.svg";
import { ReactComponent as NextArrow } from "../../assets/angle-up-solid.svg";

export default class SongCard extends Component {
	render() {
		const {
			isNextArrow,
			isPrevArrow,
			handlePrevClick,
			handleNextClick
		} = this.props;
		const { id } = this.props;
		const zIndex = {
			zIndex: id * -1
		};
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
				<div className="song-card" style={zIndex}>
					<h1>{artist}</h1>
					<span />
					<h1>{title}</h1>
				</div>
			);
		}
	}
}
