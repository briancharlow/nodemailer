const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const ejs = require('ejs');
const cron = require('node-cron');
const emailConfig = require('./config');

dotenv.config();
const transporter = nodemailer.createTransport(emailConfig);

function generateWeeklyReport() {
    const templatePath = __dirname + '/views/weekly_report.ejs';
    const data = {};

    ejs.renderFile(templatePath, data, (err, html) => {
        if (err) {
            console.error('Error generating the weekly report:', err);
        } else {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'jonathan.mwaniki@thejitu.com',
                subject: 'Weekly Report',
                html: html
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

cron.schedule('0 14 * * 5', generateWeeklyReport, {
    scheduled: true,
    timezone: 'UTC'
});

app.listen(3600, () => {
    console.log('Server is running on port 3600');
});
