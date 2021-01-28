const mongoose = require('mongoose')

const Schema = mongoose.Schema

// import mongoose from 'mongoose'
// const { Schema } = mongoose

const signature_request = new Schema({
    signer_email: { type: String },
    signer_name: { type: String },
    title: { type: String },
    message: { type: String },
    signature_id: { type: String },
    signature_status: { type: String },
    date_created: { type: Date },
    date_signed: { type: Date }
})

const SignRequest = mongoose.model('signature_request', signature_request)

module.exports = SignRequest