//const { findOne } = require('../bd/models/post');
const Post = require('../bd/models/post');
const saveImage = require('../middleware/cloudinary');

exports.getPostes = (req, res) => {

    Post.find({})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
}

exports.getOnePost = (req, res) => {

    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
}


exports.creatPost = (req, res) => {
    
    let text="";
    let imageUrl ='';

    try {
        let data =JSON.parse(req.body.json);
        text = data.text;
        if (req.file) {
           // imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        if (!text) {
            return (res.status(400).json( { "message": "bad request"}))
        } 
        
    } catch (error) {
        return res.status(400).json( error);
    }

    //const text = req.body.text;
  
    const post = new Post(
        {
            text,
            userId: req.auth.userId,
            imageUrl:/*"https://res.cloudinary.com/dkdwhd7hl/image/upload/v1668873640/Groupomania/posts/post_" +postId+"."+*/ req.file.mimetype.split('/')[1],

           // imageUrl:imageUrl
        }
    );


    post.save()
        .then((post) => {

            // Save image on cloudinary
            saveImage.saveImage(req.file,post._id)
            .then(result=>{res.status(201).json({ message: "Post save successfully" })})
            .catch(e=>res.status(400).json({ e }));

            
         })
        .catch(e => res.status(400).json({ e }));


}

exports.updatePost=(req,res)=>{

    let data =JSON.parse(req.body.json);
    let text = data.text;
    let postId= req.params.id;

    if ((text==null && !req.file) ) {
        return res.status(400).json( { "message": "bad request"});
    } 

    Post.findOne({ _id: req.params.id })
    .then(post =>{
        // Check if user is admin or author
        if (post.userId!=req.auth.userId && !req.auth.isAdmin) {
            return res.status(401).json({message:"Unauthorized"});            
        }

    // console.log("###file: ", req.file);

    // Get Object details 
    const postObject = req.file ? {
        text:text,
        imageUrl:/*"https://res.cloudinary.com/dkdwhd7hl/image/upload/v1668873640/Groupomania/posts/post_" +postId+"."+*/ req.file.mimetype.split('/')[1],
        // imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;


    } : { text:text};

    Post.updateOne({ _id: req.params.id},postObject)
    .then((post)=>{ 

         // Save image on cloudinary
         if (req.file){
             saveImage.saveImage(req.file,postId)
            .then(result=>{
                 res.status(201).json({ message: "Post updated successfully" })
            })
            .catch(e=>res.status(400).json({ e }))        
         }
         else{
              res.status(201).json({ message: "Post updated successfully" });
         }
        
    })
    .catch(e => { res.status(500).json({ e }) });

    })
    .catch(e => res.status(400).json({ e }));

}

exports.deletePost=(req,res)=>{


    Post.findOne({_id:req.params.id})
    .then( post=>{

        if (!post|| post==null) {

            return res.status(401).json({message:"bad  request"});            
        }

        // Check if user is admin or author
        if (post.userId!=req.auth.userId && !req.auth.isAdmin) {
            return res.status(401).json({message:"Unauthorized"});            
        }

        //Todo: delete the image firts

        Post.deleteOne({_id:req.params.id})
        .then(rep=>{res.status(200).json({message:"post deleted successfully"})})
        .catch(e => res.status(400).json({ e }));
    }
        
    )
    .catch(e => {res.status(400).json({ e })});
}

exports.likePost=(req,res)=>{

    Post.findOne({_id:req.query.id})
    .then( post=> {

        // Todo: Correct this one update function

        if (!post) {
            return res.status(400).json( { "message": "bad request"});          
        }

        let reqUserId = req.auth.userId;

        switch (req.query.like) {
            case '1': // like

                if (post.usersLiked.includes(reqUserId)) {
                
                    return res.status(401).json({ message: "bad request" });
                }

                post.usersLiked.push(reqUserId);

                break;

            case '0': // cancell like 

                if (!post.usersLiked.includes(reqUserId)) {

                    return res.status(401).json({ message: "bad request" });
                } 

                post.usersLiked = post.usersLiked.filter(el =>  el !== reqUserId );

                break;
 
            default:
                return res.status(400).json( { "message": "bad request"});

        }

        post.likes=post.usersLiked.length;

        Post.updateOne({ _id: req.query.id }, post)
            .then(() => { return res.status(200).json({ message: "your request has been registered" }) })
            .catch(e => { return res.status(401).json({ e }) });
        
    })
    .catch(e => { res.status(400).json({ e })});

}
