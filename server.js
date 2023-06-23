const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const cron = require('cron');
const dotenv = require('dotenv');
const ejs = require('ejs');

dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

function generateWeeklyReport() {
    const templatePath = __dirname + '/views/weekly_report.ejs';
    const data = {};

    ejs.renderFile(templatePath, data, (err, html) => {
        if (err) {
            console.error('Error generating the weekly report:', err);
        } else {
            const emailBody = `<p>Dear Jonathan,</p>
                        <p>Please find attached my weekly report.</p>
                        <p>Kind regards,</p>
                        <p>Brian Kyalo</p>`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'jonathan.mwaniki@thejitu.com',
                subject: 'Weekly Report',
                html: emailBody,
                attachments: [
                    {
                        filename: 'weekly_report.docx',
                        content: html,
                        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending the email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }
    });
}


const job = new cron.CronJob('0 14 * * 5', generateWeeklyReport, null, true, 'UTC');

app.listen(3600, () => {
    console.log('Server is running on port 3600');
});
