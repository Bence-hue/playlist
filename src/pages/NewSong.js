import React, { Component } from "react";

import Header from "../pages/components/Header";

import "../css/newsong.css";

import { ReactComponent as NEWb } from "../assets/add-button.svg";
import { ReactComponent as NEW0 } from "../assets/NEW-0-outer.svg";
import { ReactComponent as NEW1 } from "../assets/NEW-1.svg";
import { ReactComponent as NEW2 } from "../assets/NEW-2.svg";
import { ReactComponent as NEW3 } from "../assets/NEW-3.svg";
import { ReactComponent as NEW4 } from "../assets/NEW-4.svg";
import { ReactComponent as NEW5 } from "../assets/NEW-5.svg";
import { ReactComponent as NartLeft } from "../assets/new-song-left.svg";
import { ReactComponent as NartRight } from "../assets/new-song-right.svg";

export default class NewSong extends Component {
	render() {
		return (
			<div>
				<Header kolcsey={false} />
				<NEWb className="new-song-button" />
				<h2 className="new-song-h2">Új zenét akarok!</h2>
				<NEW0 className="ARTnew new0" />
				{/* <NEW1 className="ARTnew new1" /> */}
				<NEW1 className="ARTnew new1--green" />
				<NEW2 className="ARTnew new2" />
				<NEW3 className="ARTnew new3" />
				<NEW4 className="ARTnew new4" />
				<NEW5 className="ARTnew new5" />
				<NartLeft className="new-art-left" />
				<NartRight className="new-art-right" />
			</div>
		);
	}
}
