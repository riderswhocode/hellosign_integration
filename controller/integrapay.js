const axios = require('axios')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())

exports.get_token = (req, res) => {
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
        res.cookie('auth', data.data.access_token)
        res.send(data.data.access_token)
    })
    .catch(err => {
        res.send(err)
    })
}

exports.test = (req, res) => {
    
    const token = req.cookie

    res.send(token)
}

exports.update_integrapay_details = (req, res) => {
    
    const email = req.body.Email
    const givenName = req.body.Name
    const familyName = req.body.FamilyOrBusinessName
    const uniqueReference = 'test'

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
        // const email = 'ariane.r@techflow.ai'
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
            // res.send(typeof output.data)
            if((Object.keys(output.data).length === 0)  && (output.constructor === Object)) {
                res.send(`No users found`)
                
                const data = "{}"
                const config = {
                    method: 'post',
                    url: 'https://sandbox.rest.paymentsapi.io/businesses/2232/payers/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "UniqueReference": uniqueReference,
                        "FamilyOrBusinessName": familyName,
                        "GivenName": givenName,
                        "Email": email
                    }
                }

                axios(config)
                .then(response => {
                    res.send(response.data)
                })
                .catch(err => {
                    res.send(err)
                })
            }
            else {
                res.send(`I did something wrong!`)
            }
            //console.log(output)
            // if(output === '{}') {
            //     res.send(`Its empty lets create new user!!!`)
            // } else {
            //     res.send(`User has found`)
            // }
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