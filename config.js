const projectTitle = 'Top 15 Cricketers by Cumulative Test Wickets';
const sourceTitle = 'Source: Howstat.com | Created by iashris.com';
const speed = 0.005;
const rec = true;
const numBarsToShow = 15;
let lines = [
	{
		v: 10,
		l: 'Bhutan',
	},
	{
		v: 20,
		l: 'Bhutan',
	},
	{
		v: 50,
		l: 'Bhutan',
	},
	{
		v: 100,
		l: 'Bhutan',
	},
	{
		v: 200,
		l: 'Bhutan',
	},
	{
		v: 500,
		l: 'Bhutan',
	},
];
const mapping = {
	England: {
		color: [255, 0, 0],
		emoji: '🇬🇧',
	},
	Australia: {
		color: [200, 160, 31],
		emoji: '🇦🇺',
	},
	'West Indies': {
		color: [170, 0, 64],
		emoji: '🏝',
	},
	'New Zealand': {
		color: [0, 0, 0],
		emoji: '🇳🇿',
	},
	Pakistan: {
		color: [0, 102, 0],
		emoji: '🇵🇰',
	},
	India: {
		color: [0, 128, 228],
		emoji: '🇮🇳',
	},
	'Sri Lanka': {
		color: [67, 72, 138],
		emoji: '🇱🇰',
	},
	Zimbabwe: {
		color: [255, 0, 0],
		emoji: '🇿🇼',
	},
	'South Africa': {
		color: [29, 64, 51],
		emoji: '🇿🇦',
	},
	Bangladesh: {
		color: [0, 134, 60],
		emoji: '🇧🇩',
	},
};
