const hellosign = require('hellosign-sdk')({key: '08ef4e3c07263eac2ac67cb60f9eec0e7978135be9b2994104a89c04c64605a6'})
const nodemailer = require('nodemailer')
const express = require('express')
const SignRequest = require('../models/hellosign.models')

exports.create_template = (req, res) => {
    
    let title = req.body.title
    let sbj = req.body.subject
    let msg = req.body.message
    let email = req.body.email
    let name = req.body.name
    let upload_file = req.body.upload_file

    const opts = {
        test_mode: 1,
        clientId: process.env.CLIENTID,
        title: title,
        subject: sbj,
        message: msg,
        signer_roles: [
            {   
                name: 'Client',
                order: 0
            }
        ],
        files: [upload_file]
    }

    const result = hellosign.template.createEmbeddedDraft(opts)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(`Error creating template: ${err}`)
    })

}

exports.send_template = (req, res) => {
    
    let title = req.body.title
    let sbj = req.body.subject
    let msg = req.body.message
    let email = req.body.email
    let name = req.body.name

    const opts = {
        test_mode: 1,
        template_id: '765dc84a1704cffbf02ca4df7213a10fc2357d78',
        title: title,
        subject: sbj,
        message: msg,
        signing_redirect_url : 'http://zingcoach.com.au/',
        signers: [
            {
                email_address: email,
                name: name,
                role: 'Client'
            }
        ]
    }
    hellosign.signatureRequest.sendWithTemplate(opts)
    .then(res => {
        console.log(`New Signature Request has been created`)
    })
    .catch(err => {
        console.log(`There is an error:  ${err}`)
    })
}


exports.create_signature = (req, res) => {
    
    let title = req.body.title
    let sbj = req.body.subject
    let msg = req.body.message
    let email = req.body.email
    let name = req.body.name
    let upload_file = req.body.upload_file

    const opts = {
        test_mode: 1,
        clientId: process.env.CLIENTID,
        template_id: '765dc84a1704cffbf02ca4df7213a10fc2357d78',
        subject: sbj,
        message: msg,
        signing_redirect_url: 'localhost:3001/',
        signers: [
            {   
                email_address: email,
                name: name,
                role: 'Client'
            }
        ]
    }
    
    hellosign.signatureRequest.createEmbeddedWithTemplate(opts)
    .then((res) => {
        const signature = res.signature_request.signatures[0]
        if(res.statusCode == 200){
            const signer_name = signature.signer_name
            const signer_email = signature.signer_email_address
            const title = res.signature_request.title
            const message = res.signature_request.message
            const signature_id = signature.signature_id
            const signature_status = signature.status_code
            const date_created = new Date()
            const date_signed = null

            // const newSignRequest = new SignRequest({
            //     signer_email,
            //     signer_name,
            //     title,
            //     message,
            //     signature_id,
            //     signature_status,
            //     date_created,
            //     date_signed
            // })
            // SignRequest.create(newSignRequest)
            // console.log('Data uploaded to database')
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    // user: process.env.EMAIL,
                    // pass: process.env.EMAIL_PASS
                    user: 'arianejade.rey@gmail.com',
                    pass: 'jadethunder'
                }
            })
            
            const mailOptions = {
                from: 'Techflow Dev <ariane.r@techflow.ai>',
                to: signer_email,
                subject: title,
                html: `
                <p>Thanks for signing up with Techflow.ai! Click the link below to sign the document:</p>
                <br/><br/>
                <a target=_blank href='http://localhost:3001/hellosign/signurl/${signature_id}'>Sign Here!</a>
                <br/><br/>
                <p>Don't hesitate to contact us if you have any questions.</p>
                <br/><br/>
                <p>Techflow.ai Team</p><a href='techflow.ai'>Techflow.ai</a>`
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

exports.show_test_form = (req, res) => {
    res.render('agreement-form-test')
}


exports.get_sign_url = (req, res) => {
    return hellosign.embedded.getSignUrl(req.params.id)
    .then(data =>{
        const url = data.embedded.sign_url
        res.render('contract', {signUrl: url, clientId: process.env.CLIENTID})
    })
}



