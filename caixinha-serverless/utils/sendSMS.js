const https = require('https');
const { apm } = require('./apm');

module.exports = message => {
    if (!process.env.SMS_API_TOKEN) {
        return
    }
    
    const options = {
        method: 'POST',
        hostname: 'vj44dv.api.infobip.com',
        path: '/sms/2/text/advanced',
        headers: {
            Authorization: process.env.SMS_API_TOKEN,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    };

    const data = JSON.stringify({
        messages: [
            {
                destinations: [{ to: '5548998457797' }],
                from: 'Caixinha',
                text: message
            }
        ]
    });

    const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            console.log(responseData);
        });
    });

    req.on('error', (error) => {
        apm(error)
    });

    req.write(data);
    req.end();
}