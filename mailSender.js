const nodemailer = require("nodemailer");
class MailSender{
    
    sendMail(sender,receiver,subject,body){
        
        
        if(sender!=undefined && receiver!=undefined && body!=undefined && subject!=undefined){
            
            let  transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                 auth: {
                    user: 'dianna.bartell56@ethereal.email',
                    pass: 'aSJNPucysP3aJKW9Gc'
            }
            });
            let mailOptions ={
                from:sender,
                to:receiver,
                subject: subject,
                text:body
            };
          
            transporter.sendMail(mailOptions,function(err,info){
                console.log("Happy2");
                if(err){
                    console.log(err);
                    const JSON_response = {
                        message:"Mail was not sent",
                        data:err,
                        state:"Error",
                        status:false
                    };
                    const stringify_response = JSON.stringify(JSON_response);
                    return stringify_response;
                }else{
                    console.log("Happy");
                    const JSON_response = {
                        message:"Mail sent",
                        data:info.response,
                        state:"Success",
                        status:true
                    };
                    const stringify_response = JSON.stringify(JSON_response);
                    return stringify_response;
                }
            });
            
        }else{
            console.log("Happy");
            const JSON_response = {
                message:"One or more of the fields required for this request is empty",
                data:"Invalid input", 
                state:"Error"
            };
            const stringify_response = JSON.stringify(JSON_response);
            return stringify_response;
        }
    }
}
module.exports = new MailSender();