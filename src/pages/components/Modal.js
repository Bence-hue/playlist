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
		const { toggler, title, content, buttonText, onButtonClick } = this.props;
		const { opacity, display } = this.state;
		if (toggler) {
			return (
				<div id="noauth" style={{ opacity, display }}>
					<div
						className={`noauth-modal ${
							buttonText ? "noauth-modal-buttoned" : ""
						}`}
					>
						<div
							className="noauth-modal__button-wrapper"
							onClick={this.hideModal}
						>
							<Circle className="noauth-modal-button-icon noauth-circle" />
							<Times className="noauth-modal-button-icon noauth-times" />
						</div>
						<div className="noauth-modal__content">
							<h2>{title}</h2>
							<div className="noauth-modal__span" />
							<p>{content}</p>
							{buttonText ? (
								<button onClick={onButtonClick}>{buttonText}</button>
							) : (
								""
							)}
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}
