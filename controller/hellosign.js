const hellosign = require('hellosign-sdk')({key: '08ef4e3c07263eac2ac67cb60f9eec0e7978135be9b2994104a89c04c64605a6'})
const axios = require('axios')
const nodemailer = require('nodemailer')
const express = require('express')
const app = express()
const SignRequest = require('../models/hellosign.models')


exports.create_signature = (req, res) => {
    
    let sbj = req.body.subject
    let msg = req.body.message
    let email = req.body.email
    let name = req.body.name
    let upload_file = req.body.upload_file

    const opts = {
        test_mode: 1,
        clientId: process.env.CLIENTID,
        subject: sbj,
        message: msg,
        signing_redirect_url: 'localhost:3001/',
        signers: [
            {
                email_address: email,
                name: name
            }
        ],
        files: [upload_file]
    }
    //console.log(opts)
    hellosign.signatureRequest.createEmbedded(opts)
    .then((res) => {
        //console.log(res)
        const signature = res.signature_request.signature[0]
        if(res.statusCode == 200){
            const signer_name = signature.signer_name
            const signer_email = signature.signer_email_address
            const title = res.signature_request.title
            const message = res.signatreuest.message
            const signature_id = signature.signature_id
            const signature_status = signature.status_code
            const date_created = new Date()
            const date_signed = null

            const newSignRequest = new SignRequest({
                signer_email,
                signer_name,
                title,
                message,
                signature_id,
                signature_status,
                date_created,
                date_signed
            })
            SignRequest.create(newSignRequest)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '',
                    pass: ''
                }
            })

            const mailOptions = {
                from: 'Techflow Dev <ariane.r@techflow.ai>',
                to: signer_email,
                subject: title,
                html: `<a link='localhost:3001/hellosign/signurl/${signature_id}'> Sign the contract here </a>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if(err){
                    console.log(err)
                }else {
                    console.log(`Email sent: ${info.response}`)
                }
            })
        }
        
    })
    .then(() => {
        res.json({message: "New Sign request has been created"})
    })
    .catch((err) => {
        console.log(err)
    })

}

exports.show_request_form = (req, res) => {
    res.render('agreement-form')
}

exports.get_sign_url = (req, res) => {
    return hellosign.embedded.getSignUrl(req.params.id)
    .then(data =>{
        const url = data.embedded.sign_url
        res.render('contract', {signUrl: url, clientId: process.env.CLIENTID})
    })
}

exports.update_integrapay_details = (req, res) => {
    
    const IPUsername = process.env.INTEGRAPAY_USERNAME
    const IPUserKey = process.env.INTEGRAPAY_USERKEY
    const data = JSON.stringify({"Username":IPUsername,"Password":IPUserKey})
    
    const config = {
        method: 'post',
        url: 'https://sandbox.auth.paymentsapi.io/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    }
    
    axios(config)
    .then(data => {
        
        const email = 'ariane.r@techflow.ai'
        const query = {email: email}

        const config = {
            method: 'get',
            url: 'https://sandbox.rest.paymentsapi.io/businesses/2232/payers/',
            headers: {
                Authorization:`Bearer ${data.data.access_token}`
            },
            data: query
        }

        axios(config)
        .then(output => {
            res.send(output)
        })
        .catch(err => {
            console.log(`An error has been detected while querying IntegraPay`)
            res.send(err)
        })


    })
    .catch(err => {
        console.log(`Error creating access token`)
        res.send(err)
    })
}

