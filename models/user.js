const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const addressSchema = new Schema({
//     TCNumber: { type: String, required: true },
//     Country: { type: String, required: true },
//     City: { type: String, required: true },
//     District: { type: String, required: true },
//     Neighborhood: { type: String, required: true },
//     PostalCode: { type: String, required: true },
//     fulladdress: { type: String, required: true },
//     Street: { type: String, required: true },
//     BuildingNumber: { type: String, required: true },
//     Floor: { type: String, optional: true },
//     ApartmentNumber: { type: String, optional: true },
//     addressNackName: { type: String, optional: false },
// });


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['subAdmin', 'admin'],
    },
    resetToken: String,
    resetTokenExpiration: Date,
    // cart: {
    //     items: [
    //         {
    //             productId: {
    //                 type: Schema.Types.ObjectId,
    //                 ref: 'Product',
    //                 required: true
    //             },
    //             quantity: {
    //                 type: Number,
    //                 required: true
    //             }
    //         }
    //     ]
    // },
    // likedItems: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Product',
    //         required: true
    //     }
    // ],



});



module.exports = mongoose.model('User', userSchema);


