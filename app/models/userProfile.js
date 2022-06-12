const mongoose = require('mongoose')
const { Schema } = mongoose;

const userProfileSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "user"
    },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Intersex']
    },
    contactNumber: { type: String, requied: true },
    address: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String }

},
    {
        versionKey: false
    }
)

// userProfileSchema.set('timestamps', true)
module.exports = mongoose.model('userProfile', userProfileSchema)