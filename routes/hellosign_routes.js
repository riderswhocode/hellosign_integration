//Contains all HelloSign related routes
const hellosign = require('hellosign-sdk')({key: '08ef4e3c07263eac2ac67cb60f9eec0e7978135be9b2994104a89c04c64605a6'})
const router = require('express').Router()

//Controller
const hsController = require('../controller/hellosign')




const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({extended: false})

const SignRequest = require('../models/hellosign.models')

const path = require('path')
const appDir = path.dirname(require.main.filename)

router.post('/signature/create1', urlEncodedParser, (req, res) => {
    
    let sbj = req.body.subject
    let msg = req.body.message
    let email = req.body.email
    let name = req.body.name
    let uploaded_file = req.body.upload_file

    const opts = {
        test_mode: 1,
        clientId: '5f86a503c0e0f2cf9908ccbe5df1d16a',
        subject: sbj,
        message: msg,
        signing_redirect_url: '/integrapay/update',
        signers: [
            {
                email_address: email,
                name: name
            }
        ],
        files: [uploaded_file]
    }

    //hellosign.signatureRequest.createEmbedded(opts)
    hellosign.signatureRequest.send(opts)
    .then((res) => {
        console.log(res)
        // const signature = res.signature_request.signatures[0]

        // if(res.statusCode == 200) {
            
        //     const signer_name = signature.signer_name
        //     const signer_email = signature.signer_email_address
        //     const title = res.signature_request.title
        //     const message = res.signature_request.message
        //     const signature_id = signature.signature_id
        //     const signature_status = signature.status_code
        //     const date_created = new Date()
        //     const date_signed = null

        //     //MYSQL
        //     //const connection = createMySQLConnection()
        //     //Option 1
        //     //const queryString = "INSERT INTO signature_request(name,email,title,message,signature_id,status) VALUES ?"
        //     //const paramString = [signatureName, signatureEmail, signatureTitle, signatureMessage, signatureId, signatureStatus]
        //     //Option 2
        //     //const queryString1 = "INSERT INTO signature_request SET ?"
        //     //const paramString1 = { name: signatureName, email: signatureEmail, title: signatureTitle, message: signatureMessage, signature_id: signatureId, status: signatureStatus }
        //     //connection.query(queryString, paramString, (err, rows, fields) => {
        //     //    if(err){
        //     //        console.log(`Error: ${err}`)
        //     //        return
        //     //    }
        //     //    console.log('New Signature Request has been added')
                
        //     //})

            //MONGODB
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
        }
        //const signId = signature.signature_id    
        //return hellosign.embedded.getSignUrl(signId)
    )
    .then((res) => {
        //console.log('The sign url: ' + res.embedded.sign_url)
        console.log('New Sign Request has been created')
        res.redirect('/signature')
    })
    .catch((err) => {
        console.log(err)
        console.log('Error is catched!!!!')
    })

})

router.get('/signature/sign/:id', (req, res) => {
    
    //Install hellosign-embedded from npm by running npm install hellosign-embedded
    //import HelloSign from 'hellosign-embedded'  ------ ES6 Module
    //const HelloSign = require('hellosign-embedded') ------- Common JS Module

    const client = new HS()

    const signId = req.params.id

    client.open(signUrl, {
        clientId: process.env.CLIENTID
    })
    
})

router.get('/signature/signurl/:id', (req, res) => {
    
    return hellosign.embedded.getSignUrl(req.params.id)
    .then(data => 
        res.json(data.embedded.sign_url)
    )
    .catch(err => {
        console.log(err)
        console.log('Error is catched!!!')
    })
   
})

router.get('/signature/new', hsController.show_request_form)
router.post('/signature/create', urlEncodedParser, hsController.create_signature)
router.get('/signurl/:id', hsController.get_sign_url)


module.exports = router