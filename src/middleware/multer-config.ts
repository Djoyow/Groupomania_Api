import multer from 'multer'

const FileExtensions: { [k: string]: string } = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png'
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images')
	},
	filename: (req, file, cb) => {
		const name = file.originalname.split(' ').join('_')
		const extension: string = FileExtensions[file.mimetype]
		cb(null, name + '_' + Date.now() + '.' + extension)
	}
})

export default multer({ storage }).single('image')
