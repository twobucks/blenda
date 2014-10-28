module.exports = {
	db: 'mongodb://' + process.env['DB_PORT_27017_TCP_ADDR'] +
               ':' + process.env['DB_PORT_27017_TCP_PORT'] +
               '/' + 'blenda',
	port: 3000,
	portSecure: 8080,
	app: {
		name: 'Blenda'
	}
}
