const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserService {
    constructor(){}

    signUp(req, res) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                res.status(500).json(errorMessage(err));
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });

                user.save()
                    .then(doc => {
                        res.status(201).json({ message: 'User created' });
                    })
                    .catch(err => {
                        res.status(500).json(errorMessage(err));
                    });
            }
        });
    }

    deleteUser(req, res) {
        const id = req.params.id;
        User.remove({ _id: id })
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: 'User deleted',
                    request: {
                        type: 'POST',
                        url: process.env.URL + 'user/signup',
                        data: {
                            email: 'example@expm.exm',
                            password: 'String'
                        }
                    },
                    result: doc
                });
            })
            .catch(err => {
                res.status(500).json(errorMessage(err));
            });
    }
}

const errorMessage = (err) => {
    return {error:{message: err}}
}

module.exports = UserService;