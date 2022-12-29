const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
const app=express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
function testEmailAddress(emailToTest) {
    // check for @
    var atSymbol = emailToTest.indexOf("@");
    if(atSymbol < 1) return false;

    var dot = emailToTest.indexOf(".");
    if(dot <= atSymbol + 2) return false;

    // check that the dot is not at the end
    if (dot === emailToTest.length - 1) return false;

    return true;
}
app.post("/",function(req,res){
    var fname=req.body.fname;
    var lname=req.body.lname;
    var email=req.body.email;
    var tic=req.body.tic;
    var stat="pending";
    if (tic=="on")stat="subscribed";
    if(testEmailAddress(email)&&fname!=""){
    var data={
        members:[
            {email_address: email,
                status:stat,
                merge_fields: {
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };
    var jdata=JSON.stringify(data);
    var option={
        url:"https://us10.api.mailchimp.com/3.0/lists/a886cfb890",
        method:"POST",
        headers:{
            "Authorization":"krish 6aadb426d6c676218fcc9066a7a9c867-us10"
        },
        body:jdata
    };
    }
    request(option,function(error,response,body){
        if(error||(!testEmailAddress(email))||response.statusCode!=200||fname==""){
            res.sendFile(__dirname+"/failure.html");
        }else{
                res.sendFile(__dirname+"/success.html");
            }
       //console.log(response.statusCode);
    });

    
});
app.post("/failure",function(req,res){
res.redirect("/");
})
app.listen(process.env.PORT||3000,function(){
    console.log("server is running at port 3000.");
});
//6aadb426d6c676218fcc9066a7a9c867-us10
//a886cfb890