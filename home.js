const { text } = require('express');
const  express =require('express');
const server =  express();
const FirestoreClient = require('./firebase_config');
const DataManipulator = require("./data_manipulator");
const MailSender = require("./mailSender");
const mailSender = require('./mailSender');

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



server.post("/single_mail_service",function(req,res){
   const response = MailSender.sendMail(req.query.sender,req.query.receiver,req.query.subject,req.query.body);
   if(response.status==false){
       res.status(403);
       res.send(response);
   }else{
    res.status(403);
    res.send(response);
   }

});

server.post("/profile_settings",function(req,res){
    const user_email = req.query.user_token;
    const field_to_update= req.query.data;
    const value_to_update = req.query.value;
    let field={field:field_to_update,value:value_to_update};
    const update = async()=>{
        try{
          const response =  await FirestoreClient.updateData("Users",DataManipulator.decryptUserId(user_email),field);
          const responseU = await FirestoreClient.getData('Users',DataManipulator.decryptUserId(user_email));
         delete responseU.pass;
         delete responseU.date;
            const JSON_response = {
                message:""+field_to_update+" field updated as "+value_to_update,
                data:responseU,
                state:"Successful",
                status:true
            };
            const stringify_response = JSON.stringify(JSON_response);
            res.status(202);
            res.send(stringify_response);
           
        }catch(catcher){
            res.status(404);
            const JSON_responseE = {
                message:"User to update is not found",
                error:catcher.message,
                state:"error",
                status:false
            };
            const stringify_response = JSON.stringify(JSON_responseE);
            res.send(stringify_response);
        }
            

    }
    update();

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