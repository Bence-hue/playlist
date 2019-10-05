import * as firebase from "firebase/app";
import "firebase/messaging";

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
messaging.setBackgroundMessageHandler((payload) => {
	const title = "Hello World";
	const options = {
		body: payload.data.status
	};
	return self.registration.showNotification(title, options);
});
