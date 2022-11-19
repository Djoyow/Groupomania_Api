const cloudinary = require('cloudinary').v2


exports.saveImage = (file,postId)=>{

    


    cloudinary.config({ 
      cloud_name: "dkdwhd7hl", 
      api_key: "546288598723421",
      api_secret: "CMEmCXfIr6tqtFyRb3wGrtxupVc"
    });
  
    return cloudinary.uploader
    .upload('./images/'+file.filename, 
      { folder: "Groupomania/posts",
        public_id: "post_"+postId,
        overwrite: true,
        invalidate:true
      }) 

}

