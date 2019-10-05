import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/browser";
import * as firebase from "firebase/app";
import "firebase/messaging";

Sentry.init({
	dsn: "https://97dc1883092644269366ced63680323b@sentry.io/1537907"
});

const firebaseConfig = {
	apiKey: "AIzaSyCSnUYWR95Go_re_d6ClkK0AXgCXJJ5gNI",
	authDomain: "playlist-248218.firebaseapp.com",
	databaseURL: "https://playlist-248218.firebaseio.com",
	projectId: "playlist-248218",
	storageBucket: "",
	messagingSenderId: "687275559983",
	appId: "1:687275559983:web:12a27164caeadf2c3f8ada",
	measurementId: "G-HZRTRM0P1J"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
	"BEumBgeaNS-cDLgwwjnUqKfKJs9l10mDn1-99N9RXY-0LaWGUA3I5vB_80k6jKWp2A61NzeM4siW6e1kF3uyzjc"
);
messaging
	.requestPermission()
	.then(() => {
		console.log("Perm granted");
		return messaging.getToken();
	})
	.then((token) => {
		sendTokenToServer(token);
	})
	.catch((err) => {
		console.log(err);
	});

messaging.onMessage((payload) => {
	console.log("onMessage: ", payload);
});

ReactDOM.render(<App />, document.getElementById("root"));

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
