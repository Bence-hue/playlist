import React, { Component } from "react";

import SongCard from "./SongCard";

export default class SongListPage extends Component {
	render() {
		const {
			songs,
			isMobile,
			isFirstPage,
			isLastPageMobile,
			handleNextClick,
			handlePrevClick
		} = this.props;

		let noData;
		if (songs.length === 0) {
			noData = true;
		} else {
			noData = false;
		}

		const getIds = () => {
			return songs.map((d) => d.id);
		};
		const smallestId = Math.min(...getIds());

		const otherSongs = songs.filter((sg) => {
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

		let mSliceStart, mSliceStop;
		if (this.props.isFirstPage) {
			mSliceStart = this.props.id * 25;
			mSliceStop = this.props.id * 25 + 25;
		} else {
			mSliceStart = this.props.id * 25;
			mSliceStop = this.props.id * 25 + 25;
		}

		if (isMobile) {
			return (
				<div>
					{/* <h1>{`${mSliceStart} ${mSliceStop}`}</h1> */}
					{noData ? (
						""
					) : !isFirstPage ? (
						<SongCard isPrevArrow={true} handlePrevClick={handlePrevClick} />
					) : (
						""
					)}
					{otherSongs.slice(mSliceStart, mSliceStop).map((sg) => {
						return <SongCard key={sg.id} id={sg.id} song={sg} />;
					})}
					{noData ? (
						""
					) : !isLastPageMobile ? (
						<SongCard isNextArrow={true} handleNextClick={handleNextClick} />
					) : (
						""
					)}
				</div>
			);
		} else {
			return (
				<div>
					{/* <h1>{`${sliceStart} ${sliceStop}`}</h1> */}
					{otherSongs.slice(sliceStart, sliceStop).map((sg) => {
						return <SongCard key={sg.id} song={sg} />;
					})}
				</div>
			);
		}
	}
}
