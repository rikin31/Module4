const path = require('path');
const auth = require('http-auth');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', function(req, res) {
    res.render('index', { title: 'Index form'});
});

router.get('/register', function(req, res) {
    res.render('register', { title: 'Register form'});
});

router.get('/registrants', basic.check((req, res) => {
    Registration.find()
        .then((registrations) => {
            res.render('registratnts', { title: 'Listing registrations', registrations, admim: true });
        })
        .catch(() => { res.send('Sorry! Something went wrong.'); });
}));

router.post('/', [
    check('name')
        .isLength({ min: 1})
        .withMessage('Please enter a name'),
    check('email')
        .isLength({ min: 1})
        .withMessage('Please enter an email'),
    check('username')
        .isLength({ min: 1})
        .withMessage('Please enter an username'),
    check('password')
        .isLength({ min: 1})
        .withMessage('Please enter an password'),
    ],
    async (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const registration = new Registration(req.body);
            // Generate Salt Hash Password
            const salt = await bcrypt.genSalt(10)
            //Set user password to hased password
            registration.password = await bcrypt.hash(registration.password, salt)
            registration.save()
                .then(() => {
                    res.render('thankyou', {title: 'Thank You'})
                })
                .catch((err) => {
                    console.log(err);
                    res.send('Sorry! Something went wrong.');
                });
        } else {
            res.render('form', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }
    });
module.exports = router;