const nodemailer = require("nodemailer");
class MailSender{
    
    sendMail(sender,receiver,subject,body){
        
        if(sender!=undefined && receiver!=undefined && body!=undefined && subject!=undefined){
            let  transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:"Obajemusa@gmail.com",
                    pass:"gbenga12"
                }
            });
            let mailOptions ={
                from:sender,
                to:receiver,
                subject: subject,
                text:body
            };
            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    const JSON_response = {
                        message:"Mail was not sent",
                        data:err,
                        state:"Error",
                        status:false
                    };
                    const stringify_response = JSON.stringify(JSON_response);
                    return stringify_response;
                }else{
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