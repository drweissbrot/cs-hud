export const registerConfigRoutes = (router) => {
	router.get('/', (context) => {
		context.status = 302
		context.redirect('/config')
	})
}
