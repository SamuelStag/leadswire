class DataManipulator{
    constructor(){

    }
     getUserId(user_email){
        if(user_email!=undefined){
            let result=user_email.replace("@","~");
            result = result.replace(".com","");
            result = Buffer.from(result).toString("base64")+":"+Buffer.from(toString(Date.now)).toString("base64")+":"+btoa(toString((Math.floor(Date.now() / 1000))));
            return result;
        }else{
            return "Email address  not captured";
        }
      
    }
    getBasicUserId(user_email){
        
       if(user_email!=undefined){
           
        let result=user_email.replace("@","~");
        result = result.replace(".com","");
        return result;
       }else{
        return "Email address  not captured";
       }
        

    }
    decryptUserId(userId){
        try{
        let id_raw = userId.split(":");
        let user_id = id_raw[0];
        user_id = atob(user_id);
        return user_id;
        }catch(catcher){

           
        }
        

    }
    getTripId(initiator,time){
        return btoa(toString(initiator+(Math.floor(Date.now() / 1000))));
    }
}
module.exports = new DataManipulator();