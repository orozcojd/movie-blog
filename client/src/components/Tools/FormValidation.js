export default {
	titleRules: 
		[
			v => !!v || 'Title is required',
			v => (v && v.length <= 90) || 'Title must be less than 90 characters'
		],
	
	contributorRules: 
		[
			v => !!v || 'Contributor name is required',
			v => (v && v.length <= 30) || 'Contributor must be less than 30 characters'
		],
	descriptionRules: 
		[
			v => !!v || 'Description is required',
			v => (v && v.length <= 120) || 'Description must be less than 120 characters'
		],
	imageRules: 
		[
			// v => !!v || 'Image is required',
			v => (!v|| (v && (v.endsWith(".jpg") || v.endsWith("jpeg") || v.endsWith(".bmp")
		|| v.endsWith(".gif") || v.endsWith(".png")))) || 'Must be a valid image format'
		],
	realmRules: 
		[
			v => !!v || 'Realm is required',
			v => (v && v._id !== undefined && v._id !== null) || 'Realm must be selected from the following drop down.'
		],
	bioRules: 
		[
			v => (!v || v.length <= 800 || 'Bio must be less than 800 characters')
		]
}