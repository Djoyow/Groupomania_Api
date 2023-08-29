import mongoose from 'mongoose'

let attempt = 0

export default function connect() {
	// TODO use env vars
	const mongo_uri = 'mongodb+srv://PiiquanteApi:P72Pu93oxGYB4NQf@cluster0.cdoqs9d.mongodb.net/test'
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
	console.log('connecting to database...')

	// TODO fix mongoose options
	mongoose
		.connect(mongo_uri, {})
		.then(() => console.log('Connexion à MongoDB réussie !'))
		.catch((e: Error) => {
			console.log('e: ', e)
			console.log('Connexion à MongoDB échouée !')

			if (attempt < 5) {
				console.log('retrying connection in ' + 5 * attempt + ' seconds')
				setTimeout(connect, 5 * attempt * 1000)
				attempt++
			}
		})
}
