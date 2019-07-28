import React, { Component } from "react";

import Header from "../pages/components/Header";

import "../css/newsong.css";

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
				<h1>Hello World!</h1>
				<NartLeft className="new-art-left" />
				<NartRight className="new-art-right" />
			</div>
		);
	}
}
