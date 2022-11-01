const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const validator = require("email-validator");

const User = require('../bd/models/user');


exports.signup = (req, res) => {

    // Create a schema
    var schema = new passwordValidator();

    // Add properties to it
    schema
        .is().min(8)                    // Minimum length 8
        .is().max(100)                  // Maximum length 100
        .has().uppercase()              // Must have uppercase letters
        .has().lowercase()              // Must have lowercase letters
        .has().digits(1)                // Must have at least 1 digits
        .has().not().spaces()           // Should not have spaces
        .has().symbols()                // Must have symbols

    if (!schema.validate(req.body.password)) {

        return res.status(401).json({ "message": "Mot de passe incorrect" })
    }

    if (!validator.validate(req.body.email)) {

        return res.status(401).json({ "message": "email incorrect" })
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            const user = new User({ email: req.body.email, password: hash, userName:req.body.userName });

            user.save()
                .then((user) => {
                    res.status(201).json({ "message": "user creat successfully" })
                })
                .catch((e) => { res.status(400).json({ e }) });
        })
        .catch((e) => { res.status(500).json({ e }) })

}

exports.login = (req, res) => {

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ 'message': "email ou mot de passe incorrect" })
            }

            bcrypt.compare(req.body.password, user.password)
                .then(result => {

                    if (result) {
                        return res.status(200).json({
                            userId: user._id,
                            isAdmin:user.isAdmin,
                            token: jwt.sign(
                                { userId: user._id, isAdmin:user.isAdmin },
                                'sss',
                                { expiresIn: '30 days' }
                            )
                        });
                    }
                    res.status(401).json({ 'message': "Identifiants incorrects" })
                });

        })
        .catch((e) => {
            res.status(500).json({ e })
        });
}

exports.getUserName = (req, res) => {
    User.findOne({ _id: req.params.userId })
        .then(user => res.status(200).json(user.userName))
        .catch(error => {
            console.log('error:',error);
            res.status(400).json({ error })});
}