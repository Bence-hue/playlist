import React, { Component } from "react";
import { ReactComponent as Circle } from "../../assets/circle-solid.svg";
import { ReactComponent as Times } from "../../assets/times-solid.svg";
import "../../css/modal.scss";

export default class Modal extends Component {
	state = {
		opacity: 1,
		display: "block"
	};
	hideModal = () => {
		this.setState({ opacity: 0 });
		setTimeout(() => {
			this.setState({ display: "none" });
		}, 230);
	};
	render() {
		const { toggler, title, content } = this.props;
		const { opacity, display } = this.state;
		if (toggler) {
			return (
				<div id="noauth" style={{ opacity: opacity, display: display }}>
					<div className="noauth-modal">
						<div className="noauth-modal__button-wrapper" onClick={this.hideModal}>
							<Circle className="noauth-modal-button-icon noauth-circle" />
							<Times className="noauth-modal-button-icon noauth-times" />
						</div>
						<div className="noauth-modal__content">
							<h2>{title}</h2>
							<div className="noauth-modal__span" />
							<p>
								{content}
								{/* {" "}
								<span role="img" aria-label="winking face" style={{ fontStyle: "normal" }}>
									
								</span> */}
							</p>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}