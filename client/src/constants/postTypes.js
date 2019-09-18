export const root = {
	path: '/',
	name: 'root'
}
export const articleView = {
	path: '/article/:id',
	name: 'article-view'
}
export const tagView = {
	path: '/tag/:urlTag',
	name: 'tag-view'
}
export const aboutContributor = {
	path: '/contributors/:contributor/:id',
	name: 'about-contributor'
}
export const aboutView = {
	path: '/about',
	name: 'about'
}
export const contactView = {
	path: '/contact',
	name: 'contact'
}
export const notFound = {
	path: '*',
	name: 'not-found'
}