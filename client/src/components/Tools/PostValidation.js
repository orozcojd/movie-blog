export default {
	titleRules: 
		[
			v => !!v || 'Title is required',
			v => (v && v.length <= 90) || 'Title must be less than 90 characters'
		],
	
	authorRules: 
		[
			v => !!v || 'Author is required',
			v => (v && v.length <= 30) || 'Author must be less than 15 characters'
		],
	descriptionRules: 
		[
			v => !!v || 'Description is required',
			v => (v && v.length <= 120) || 'Description must be less than 120 characters'
		],
	imageRules: 
		[
			v => !!v || 'Image is required',
			v => (v && (v.endsWith(".jpg") || v.endsWith("jpeg") || v.endsWith(".bmp")
		|| v.endsWith(".gif") || v.endsWith(".png"))) || 'Must be a valid image format'
		],
	realmRules: 
		[
			v => !!v || 'Realm is required',
			v => (v && v.length <= 20) || 'Realm must be less than 20 characters'
		],
}