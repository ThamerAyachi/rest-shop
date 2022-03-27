const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class UserService {
    constructor(){}

    signUp(req, res) {
        if (req.body.password.length < 8) {
            res.status(500).json(errorMessage('Password must be 8 characters'));
        } else {
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
    }

    login(req, res) {
        User.findOne({ email: req.body.email }).exec()
            .then(user => {
                if (user) {
                    bcrypt.compare(req.body.password, user.password, (err, result) => {
                        if (err) {
                            return res.status(401).json(errorMessage('Auth failed'));
                        }
                        if (result) {
                            const token = jwt.sign(
                                { _id: user._id, email: user.email },
                                process.env.JWT_KEY,
                                { expiresIn: "2h" }
                            );
                            return res.status(200).json({
                                message: 'Auth successful',
                                token: token
                            });
                        }

                        res.status(401).json(errorMessage('Auth failed'));
                    });
                } else {
                    return res.status(401).json(errorMessage('Auth failed'));
                }
            })
            .catch(err => {
                res.status(500).json(errorMessage(err));
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