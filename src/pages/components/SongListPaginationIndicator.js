import React, { Component } from "react";

import "../../css/pagination.css";

export default class Indicator extends Component {
	render() {
		const { currentPage, lastPage } = this.props;
		return (
			<div className="pagination">
				<h2>{currentPage}</h2>
				<span />
				<h2>{lastPage}</h2>
			</div>
		);
	}
}
