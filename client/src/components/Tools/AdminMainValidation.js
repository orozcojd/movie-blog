export default {
	tagRules: 
		[
			v => !!v || 'Tag is required',
			// v => (v && v.split(' ').length <= 1) || 'Tag must be separated by "-" character',
			v => (v && v.length <= 35) || 'Tag length must not exceed 35 characters'
		],
	newTagRules:
		[
			v => !!v.trim() || 'Tag is required',
			v => (v && v.length <= 35) || 'Tag length must not exceed 35 characters'
		],
	emailRules:
		[
			v => !!v.trim() || 'Email is required',
			v => (v && v.length <= 40) || 'Email length must not exceed 40 characters',
			v => (v && v.indexOf('@') !== -1) || 'Must be a valid email address.'
		],
	contributorRules: 
		[
			v => !!v.trim() || 'Contributor name is required',
			v => (v && v.length <= 20) || 'Contributor name length must not exceed 20 characters',
		],
	passwordRules: 
	[
		v => !!v || 'Password is required',
		v => (v && v.length <= 300) || 'PAssword name length must not exceed 300 characters',
	],
	permissionRules: 
	[
		v => !!v || 'Permission level is required'
	]
}