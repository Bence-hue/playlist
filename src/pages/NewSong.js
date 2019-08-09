import React, { Component } from "react";
import { Transition, animated } from "react-spring/renderprops";

import Header from "../pages/components/Header";
import NewSongQuery from "../pages/components/NewSongQuery";

import "../css/newsong.css";

import dash1 from "../assets/Dash-trans-1_cut.png";
import dash2 from "../assets/Dash-trans-2_cut.png";
import dash3 from "../assets/Dash-trans-3_cut.png";
import dash4 from "../assets/Dash-trans-4_cut.png";
import dash5 from "../assets/Dash-trans-5_cut.png";

import { ReactComponent as NEW0 } from "../assets/NEW-0.svg";
import { ReactComponent as NEWb } from "../assets/add-button.svg";
import { ReactComponent as NartLeft } from "../assets/new-song-left.svg";
import { ReactComponent as NartRight } from "../assets/new-song-right.svg";

export default class NewSong extends Component {
	state = {
		fill: "",
		isButtonVisible: true,
		isFormVisible: false
	};
	fillButton = percent => {
		this.setState({ fill: percent });
	};
	dashRed = () => {
		this.setState({ isDashRed: true });
	};
	initQuery = () => {
		this.setState({ isButtonVisible: false, isFormVisible: true });
		setTimeout(() => {
			this.setState({ fill: 33 });
		}, 1400);
	};
	render() {
		const { fill, isDashRed } = this.state;
		return (
			<React.Fragment>
				<div className="new-header">
					<Header kolcsey={false} />
				</div>
				<Transition
					native
					items={this.state.isButtonVisible}
					from={{ opacity: 1 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0 }}
					config={{ duration: 600 }}
				>
					{show =>
						show &&
						(props => (
							<animated.div style={props}>
								<NEWb
									className="new-song-button"
									onMouseEnter={this.fillButton.bind(this, 100)}
									onMouseLeave={this.fillButton.bind(this, 0)}
									onClick={this.initQuery}
								/>
								<h2 className="new-song-h2">Új zenét akarok!</h2>
							</animated.div>
						))
					}
				</Transition>

				<Transition
					native
					items={this.state.isFormVisible}
					from={{ opacity: 0 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 1 }}
					config={{ duration: 400, delay: 1600 }}
				>
					{show =>
						show &&
						(props => (
							<animated.div style={props}>
								<NewSongQuery fill={this.fillButton} dashRed={this.dashRed} />
							</animated.div>
						))
					}
				</Transition>
				<div className="new-button-wrapper">
					<NEW0 className={`new-0 ${isDashRed ? "new-svg-red" : ""}`} />
					<img src={dash1} alt="dash1" className="dash1" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="700.05"
						height="700.05"
						className="new-svg svg1"
					>
						<g transform="translate(-619.143 -262.094)">
							<circle
								transform="translate(627 271)"
								cx="341.5"
								cy="341.5"
								r="341.5"
								stroke="#cfcfcf"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="700.05"
						height="700.05"
						className={`new-svg svg1 svg-animated ${
							fill === 33 ? "fill33 " : ""
						}${fill === 66 ? "fill66 " : ""}${fill === 100 ? "fill100 " : ""}${
							isDashRed ? "new-svg-red" : ""
						}`}
					>
						<g transform="translate(-619.143 -262.094)">
							<circle
								transform="translate(627 271)"
								cx="341.5"
								cy="341.5"
								r="341.5"
								stroke="#139C61"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>

					<img src={dash2} alt="dash2" className="dash2" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="690.014"
						height="690.014"
						className="new-svg svg2"
					>
						<g transform="matrix(0.819, 0.574, -0.574, 0.819, 12.247, -559.303)">
							<circle
								cx="314.522"
								cy="314.522"
								r="314.522"
								transform="translate(475.023 233.94)"
								stroke="#cfcfcf"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="690.014"
						height="690.014"
						className={`new-svg svg2 svg-animated ${
							fill === 33 ? "fill33 " : ""
						}${fill === 66 ? "fill66 " : ""}${fill === 100 ? "fill100 " : ""}${
							isDashRed ? "new-svg-red" : ""
						}`}
					>
						<g transform="matrix(0.819, 0.574, -0.574, 0.819, 12.247, -559.303)">
							<circle
								cx="314.522"
								cy="314.522"
								r="314.522"
								transform="translate(475.023 233.94)"
								stroke="#139C61"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<img src={dash3} alt="dash3" className="dash3" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="705.296"
						height="705.296"
						viewBox="0 0 805.296 805.296"
						className="new-svg svg3"
					>
						<g transform="matrix(0.342, 0.94, -0.94, 0.342, 602.886, -624.163)">
							<circle
								cx="330.759"
								cy="330.759"
								r="330.759"
								transform="translate(565.075 208.917)"
								stroke="#cfcfcf"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="705.296"
						height="705.296"
						viewBox="0 0 805.296 805.296"
						className={`new-svg svg3 svg-animated ${
							fill === 33 ? "fill33 " : ""
						}${fill === 66 ? "fill66 " : ""}${fill === 100 ? "fill100 " : ""}${
							isDashRed ? "new-svg-red" : ""
						}`}
					>
						<g transform="matrix(0.342, 0.94, -0.94, 0.342, 602.886, -624.163)">
							<circle
								cx="330.759"
								cy="330.759"
								r="330.759"
								transform="translate(565.075 208.917)"
								stroke="#139C61"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<img src={dash4} alt="dash4" className="dash4" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="760.465"
						height="760.465"
						viewBox="0 0 760.465 760.465"
						className="new-svg svg4"
					>
						<g transform="translate(884.673 -481.257) rotate(90)">
							<circle
								cx="264.521"
								cy="264.521"
								r="264.521"
								transform="translate(596.451 240.215)"
								stroke="#cfcfcf"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="760.465"
						height="760.465"
						viewBox="0 0 760.465 760.465"
						className={`new-svg svg4 svg-animated ${
							fill === 33 ? "fill33 " : ""
						}${fill === 66 ? "fill66 " : ""}${fill === 100 ? "fill100 " : ""}${
							isDashRed ? "new-svg-red" : ""
						}`}
					>
						<g transform="translate(884.673 -481.257) rotate(90)">
							<circle
								cx="264.521"
								cy="264.521"
								r="264.521"
								transform="translate(596.451 240.215)"
								stroke="#139C61"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<img src={dash5} alt="dash5" className="dash5" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="687.394"
						height="687.395"
						viewBox="0 0 687.394 687.395"
						className="new-svg svg5"
					>
						<g transform="translate(1257.407 91.743) rotate(135)">
							<circle
								cx="238.031"
								cy="238.031"
								r="238.031"
								transform="translate(586.218 229.901)"
								stroke="#cfcfcf"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="687.394"
						height="687.395"
						viewBox="0 0 687.394 687.395"
						className={`new-svg svg5 svg-animated ${
							fill === 33 ? "fill33 " : ""
						}${fill === 66 ? "fill66 " : ""}${fill === 100 ? "fill100 " : ""}${
							isDashRed ? "new-svg-red" : ""
						}`}
					>
						<g transform="translate(1257.407 91.743) rotate(135)">
							<circle
								cx="238.031"
								cy="238.031"
								r="238.031"
								transform="translate(586.218 229.901)"
								stroke="#139C61"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="10"
								fill="none"
							/>
						</g>
					</svg>
				</div>
				<NartLeft className="new-art-left" />
				<NartRight className="new-art-right" />
			</React.Fragment>
		);
	}
}
