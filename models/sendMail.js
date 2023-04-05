const nodemailer = require("nodemailer");
const sendMail = async(req,res)=>{
    const id = req.params.id;
    console.log({id})
    console.log(req.body);
    let testAccount = await nodemailer.createTestAccount();
    // console.log(testAccount)
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jace59@ethereal.email',
            pass: 'Bh6kakXhsaJ1Q1MJcX'
        }
    });
    let info = await transporter.sendMail({
        from: `"Sajal Suman 👻" <${testAccount.user}>`, // sender address
        to: `${req.body.receiversMail}`, // list of receivers
        subject: "Hello User, Here is the download link of ", // Subject line
        text: "Hello world?", // plain text body
        html: `Here is your link:<br> <a href="${req.body.url}">${req.body.url}</a>`, // html body
      });
      console.log(info);
    res.redirect(`/upload/${id}`);
}

module.exports = sendMail;