import { v2 as cloudinary } from 'cloudinary'

export function saveImage(file: Express.Multer.File, postId: string) {
	cloudinary.config({
		cloud_name: 'dkdwhd7hl',
		api_key: '546288598723421',
		api_secret: 'CMEmCXfIr6tqtFyRb3wGrtxupVc'
	})

	return cloudinary.uploader.upload('./images/' + file.filename, {
		folder: 'Groupomania/posts',
		public_id: 'post_' + postId,
		overwrite: true,
		invalidate: true
	})
}
