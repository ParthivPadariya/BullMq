const { Worker } = require('bullmq')
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: '', // Your email address
        pass: ''// Your email password
    },
});

function SendMessageFromQueue() {
    
    const worker = new Worker('email-queue', async (job) => {
        console.log(job.data);
        console.log(`\n\nI Got a message `);
        console.log(`Message rec id: ${job.id}`);
        console.log('Processing message');
        
        await transporter.sendMail(job.data,(error, info) => {
            if (error) {
                console.log("Error");
            }
            else{
                console.log('Email sent successfully:', info.response);
                return
            }
        })
        console.log('send email to ', job.data.to);
    }, 
    
    {
        connection: {
            host: '',
            port: ,
            password: '',
            username: ''
        }

    }).on('completed',() => {
        console.log("message Send");
    }).on('error', () => {
        console.log("Error Occuered");
    })
}
module.exports = { SendMessageFromQueue }
