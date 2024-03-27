import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp({
	apiKey: "AIzaSyAkZDeE0a7-ppf1kwi_9dnwXcwZVfgrfGA",
	authDomain: "smart-ide.firebaseapp.com",
	projectId: "smart-ide",
	storageBucket: "smart-ide.appspot.com",
	messagingSenderId: "778148653902",
	appId: "1:778148653902:web:f710d59b33a87d1a51cc1f",
});

export const auth = getAuth(app);
export default app;
