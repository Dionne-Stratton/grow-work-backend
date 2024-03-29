const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// account_type: 0 = professional profile, 1 = company profile
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    account_type: {
        type: String,
        required: false
    }
})

userSchema.pre('save', function(next) {
    const user = this
    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }

            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function(pwd) {
    const user = this

    return new Promise((resolve, reject) => {
        bcrypt.compare(pwd, user.password, (err, isMatch) => {
            if (err) {
                return next(err)
            }

            if (!isMatch) {
                return reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

mongoose.model('User', userSchema)