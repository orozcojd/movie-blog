import { AbilityBuilder, Ability } from '@casl/ability'

export default function (user) {
	const { rules, can, cannot } = AbilityBuilder.extract()

	can('read', 'all')
	switch(user.permission.name) {
	case 'GUEST':
		can('view', 'all')
		break;
	case 'CREATOR':
		can(['create', 'read', 'update', 'delete', 'view'], 'all')
		break;
	case 'ADMINISTRATOR':
		can(['create'], 'User')
		can('update', 'Contributor', {_id: user.contributorId})
		can(['read', 'update', 'delete', 'create'], 'Post')
		can(['read', 'update', 'create'], 'Tag')
		can(['view'], ['Contributor', 'Post', 'Tag', 'User'])
		cannot(['view'], ['Users'])
		break;
	case 'CONTRIBUTOR':
		can(['read', 'create'], ['Post', 'Tag'])
		can('update', ['Tag'], ['name'], {realm: false})
		can(['update', 'delete'], 'Post', {contributorId: user.contributorId})
		can(['read', 'update', 'create'], 'Contributor', {_id: user.contributorId})
		can(['view'], ['Contributor', 'Post', 'Tag'])
		cannot(['view'], ['Users', 'User'])
	}
	// return new Ability(rules)
	return new Ability(rules, {
		subjectName(subject) {
			if (!subject || typeof subject === 'string') {
				console.log(subject)
				return subject;
			}
			const Type = typeof subject === 'object' ? subject.__type : subject;
			return Type
		}
		// implement your logic here which detects subject's name
	})
	
}