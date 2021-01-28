const axios = require('axios')
const express = require('express')

const app = express()

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