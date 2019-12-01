export default {
	convertDate(dateTime) {
		const date = new Date(dateTime).toLocaleString('en-us',
			{
				month: 'long',
				weekday: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			});
		return date;
	},
};
