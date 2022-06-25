const { text } = require('express');
const  express =require('express');
const server =  express();
const nodemailer = require("nodemailer");
const FirestoreClient = require('./firebase_config');
const DataManipulator = require("./data_manipulator");

server.get('/',function(req,res){
    res.send("WELCOME");


});

server.post('/login', function(req,res){
    const user_name = req.query.email;
    const user_pass = req.query.pass;
    
    const result = async() =>{
        const response = await FirestoreClient.getData('Users',DataManipulator.getBasicUserId(user_name));
        
        try{
            if(response!=undefined){
                if(response.pass==user_pass){
                    
                    const response =await FirestoreClient.getData("Users",DataManipulator.getBasicUserId(user_name));
                    response["token"]=DataManipulator.getUserId(user_name);
                    delete response.pass;
                    delete response.date;
                    const JSON_response = {
                        message:"Login Successful",
                        data:response,
                        state:"Success",
                        status:true
                    };
                    const stringify_response = JSON.stringify(JSON_response);
                    res.status(200);
                    res.send(stringify_response);
                
        
                }else{
                    res.status(400);
                    const JSON_response = {
                        message:"Invalid login details",
                        data:"Password not correct",
                        state:"Error",
                        status:false
                        
                    };
                    const stringify_response = JSON.stringify(JSON_response);
                    res.send(stringify_response);
                }
            }else{
                const JSON_response = {
                    message:"User not found",
                    data:"User has no account with leadswire",
                    state:"Error",
                    status:false
                };
                const stringify_response = JSON.stringify(JSON_response);
                res.status(404);
                res.send(stringify_response);
            }

        }catch(catcher){
               
            const JSON_response = {
                message:"User not found",
                data:catcher, 
                state:"Error",
                status:false
            };
            const stringify_response = JSON.stringify(JSON_response);
            res.status(404);
            res.send(stringify_response);
        }
     
        
    }
    result();
});



server.post("/mail_service",function(req,res){
    const sender = req.query.sender;
    const receiver = req.query.receiver;
    const subject = req.query.subject;
    const body = req.query.body;
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
                res.status(403);
                res.send(stringify_response);
            }else{
                const JSON_response = {
                    message:"Mail sent",
                    data:info.response,
                    state:"Success",
                    status:true
                };
                const stringify_response = JSON.stringify(JSON_response);
                res.status(200);
                res.send(stringify_response);
            }
        });
        
    }else{
        const JSON_response = {
            message:"One or more of the fields required for this request is empty",
            data:"Invalid input", 
            state:"Error"
        };
        const stringify_response = JSON.stringify(JSON_response);
        res.status(404);
        res.send(stringify_response);
    }

});
 server.post("/addschedule",function(req,res){
    const date = req.query.date;
    const time = req.query.time;
    const name = req.query.name;
    const user_id = req.query.token;
    const data ={date:date, time:time, name:name};
    if(date!=undefined && time!=undefined && user_id!=undefined && name!=undefined){
        const save = async()=>{
            await FirestoreClient.save('scheduler',DataManipulator.decryptUserId(user_id),data);
            const stringify_response = JSON.stringify({
                message:"Schedule added Successfully",
                data:data,
                status:true,
                state:"Success"
            });
            res.status(201);
            res.send(stringify_response);
        }
        save();
    }
   

 });

server.post('/register', function(req,res){
    let user_name = req.query.name;
    let user_email = req.query.email;
    let user_phone =  req.query.phone;
    let user_pass = req.query.pass;
    let user_details = {name:"",email:"",phone:"",pass:"",date:""};
    if(user_name!=undefined && user_email!=undefined && user_phone!=undefined && user_pass!=undefined){
        user_details.name=user_name;
        user_details.email= user_email; 
        user_details.pass= user_pass; 
        user_details.phone=user_phone;
        user_details.date= new Date().toString();
        const user_id =DataManipulator.getUserId(user_email);
        const save = async() => {
            const response = await FirestoreClient.getData('Users',DataManipulator.decryptUserId(user_id));

            if(response==undefined){
            await FirestoreClient.save('Users',DataManipulator.decryptUserId(user_id),user_details);
            delete user_details.pass;
            delete user_details.date;
            user_details["token"]=user_id;
            const stringify_response = JSON.stringify({
                message:"Registered Successfully",
                data:user_details,
                status:true,
                state:"Success"
            });
            res.status(201);
            res.send(stringify_response);

            
        }else{
            const stringify_response = JSON.stringify({
                message:"Account already exist",
                data:"Duplicate entry",
                state:"error",
                status:false
            });
            res.status(409);
            res.send(stringify_response);
        }
    }
        
        save();

        
    }else{
        res.send("Validation error, incomplete data");
    }
   
});

server.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening on port %d ",this.address().port,process.env.GOOGLE_APPLICATION_CREDENTIALS ="./deliiv_credentials.json");
});