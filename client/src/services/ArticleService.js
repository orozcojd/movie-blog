import Api from '@/services/Api';

export default {
	showArticles() {
		return Api().get('articles');
	},
};
