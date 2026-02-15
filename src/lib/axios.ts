import axios from "axios";

export const axiosSpotifyAccounts = axios.create({
	baseURL: "https://accounts.spotify.com",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
	timeout: 10000,
});

export const axiosSpotifyAPI = axios.create({
	baseURL: "https://api.spotify.com/v1",
	timeout: 10000,
});
