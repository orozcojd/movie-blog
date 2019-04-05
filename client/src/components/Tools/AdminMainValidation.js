export default {
	tagRules: 
		[
			v => !!v || 'Tag is required',
			v => (v && v.split(' ').length <= 1) || 'Tag must be separated by "-" character',
			v => (v && v.length <= 35) || 'Tag length must not exceed 35 characters'
		],
	newTagRules:
    [
    	v => !!v.trim() || 'Tag is required',
    	v => (v && v.length <= 35) || 'Tag length must not exceed 35 characters'
    ],
}