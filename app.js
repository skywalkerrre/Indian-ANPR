const experss=require("express");
const https=require("https");
const bodyParser=require("body-parser")
const { parse } = require("path");
const app=experss();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended : true}))

const { createPool } = require("mysql2");

const pool=createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"rto"
});

// mongoDB 

// const mongoose=require("mongoose");
// const { stringify } = require("querystring");
// mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://localhost:27017/RTO")
// const loginSchema=new mongoose.Schema({
//     username:String,
//     password:String
// });

// const Login=mongoose.model("Login",loginSchema);


var temp;

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/HTML/index.html")
})

// app.get("/adminLogin",(req,res)=>{
//     res.sendFile(__dirname+"HTML/admin/adminLogin.html")
// })



app.get("/admin",(req,res)=>{
    res.render(__dirname+"/HTML/admin/adminLogin.html",{token:null});
});

app.get("/user",(req,res)=>{
    res.render(__dirname+"/HTML/user/userLogin.html",{token:null});
});

app.get("/afterAdminLogin",(req,res)=>{
    res.sendFile(__dirname+"/HTML/admin/afterAdminLogin.html");
});

app.get("/afterUserLogin",(req,res)=>{
    res.sendFile(__dirname+"/HTML/user/afterUserLogin.html");
});

app.get("/vehicleDetails",(req,res)=>{
    res.sendFile(__dirname+"/HTML/admin/vehicleDetails.html");
});

app.get("/updateDocument/dType/:val",(req,res)=>{
    res.render(__dirname+"/HTML/admin/updateDocument.ejs",{token:req.params.val});
});

app.get("/dlDetails",(req,res)=>{
    res.sendFile(__dirname+"/HTML/admin/dlDetails.html");
});

app.get("/createDL",(req,res)=>{
    res.sendFile(__dirname+"/HTML/admin/createDL.html");
});

app.get("/updateDL",(req,res)=>{
    res.sendFile(__dirname+"/HTML/admin/updateDL.html");
});

app.get("/createCustomerID/v",(req,res)=>{
    res.render(__dirname+"/HTML/admin/createCustomerID.html",{token:"vehicle"});
});

app.get("/getCustomerID/v",(req,res)=>{

    res.render(__dirname+"/HTML/admin/getCustomerID.html",{token:"vehicle"});
});

app.get("/createCustomerID/dl",(req,res)=>{
    res.render(__dirname+"/HTML/admin/createCustomerID.html",{token:"dl"});
});

app.get("/getCustomerID/dl",(req,res)=>{

    res.render(__dirname+"/HTML/admin/getCustomerID.html",{token:"dl"});
});

app.get("/getVehicleDetails",(req,res)=>{
    res.sendFile(__dirname+"/HTML/user/getVehicleDetails.html");
});

app.get("/getOwnerDetails",(req,res)=>{
    res.sendFile(__dirname+"/HTML/user/getOwnerDetails.html");
});

app.get("/getDLDetails",(req,res)=>{
    res.sendFile(__dirname+"/HTML/user/getDLDetails.html");
});

app.get("/addMissingVehicle",(req,res)=>{
    res.sendFile(__dirname+"/HTML/user/addMissingVehicle.html");
});






                               //LOGIN

app.post("/register",(req,res)=>{
    const person=req.body.person;
    if(person == "user")
        res.render(__dirname+"/HTML/register.ejs",{token:"user",token1:null,token2:null,token3:null,token4:null,token5:null,token6:null,token7:null,token8:null,token9:null,token10:null});
    else    
        res.render(__dirname+"/HTML/register.ejs",{token:"admin",token1:null,token2:null,token3:null,token4:null,token5:null,token6:null,token7:null,token8:null,token9:null,token10:null});
});

app.post("/reg",(req,res)=>{
    const person=req.body.person;
    const username=req.body.username;
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;
    const phno=req.body.phno;
    const password=req.body.password;
    const password1=req.body.password1;

    if(person == "user"){
        pool.query(`select count(*) as user_no from USER`,(err,result)=>{
            if(err)
                console.log(err);
            else{
                setValue((result[0].user_no)+1);
            }    
        });
    
        function setValue(user_id){
            user_id=user_id.toString();
            while(user_id.length < 6){
                user_id='0'+user_id;
            }
            user_id="USR"+user_id;

            if(password === password1){
                pool.query(`insert into LOGIN values(?,?)`,[username,password],(err,result)=>{
                    if(err)
                        res.render(__dirname+"/HTML/register.ejs",{token:"user", token1:fname, token2:lname, token3:phno, token4:email, token5:null,token6:null,token7:null,token8:null,token9:null, token10:"username alreay exist"});
                    else{
                        pool.query(`insert into USER values(?,?,?,?,?,?)`,[user_id,fname,lname,username,phno,email],(err,result)=>{
                            if(err)
                                console.log(err);
                            else{
                                res.sendFile(__dirname+"/HTML/user/userLogin.html",{token:null});
                            }
                        });

                        // const login=new Login({
                        //     username:username,
                        //     password:password
                        // });
                        
                        // login.save();
                    }
                });
            }
            else
                res.render(__dirname+"/HTML/register.ejs",{token:"user", token1:fname, token2:lname, token3:phno, token4:email, token5:username, token6:null,token7:null,token8:null,token9:null, token10:"Enter correct password"});   
        }
    }

    else if(person == "admin"){
        const address=req.body.address;
        const designation=req.body.designation;
        
        pool.query(`select count(*) as admin_no from RTO_ADMIN`,(err,result)=>{
            if(err)
                console.log(err);
            else{
                setValue((result[0].admin_no)+1);
            }    
        });
    
        function setValue(admin_id){
            admin_id=admin_id.toString();
            while(admin_id.length < 4){
                admin_id='0'+admin_id;
            }
            admin_id="ADMIN"+admin_id;

            pool.query(`insert into RTO_ADMIN values(?,?,?,?,?,?,?,?)`,[admin_id,fname,lname,address,designation,phno,email,password],(err,result)=>{
                if(err)
                    console.log(err);
                else{
                    res.sendFile(__dirname+"/HTML/admin/adminLogin.html");
                }
            });   
        }

    }
});



                              // ADMIN



app.post("/adminLogin",(req,res)=>{
    const admin_id=req.body.admin_id;
    const password=req.body.password;

    pool.query(`select password from RTO_ADMIN where admin_id=?`,[admin_id],(err,result)=>{
        if(err)
            console.log(err);
        
        else if(result[0] == null || result[0].password !== password)
            res.render(__dirname+"/HTML/admin/adminLogin.html",{token:"Invalid admin id or password."});
        
        else
            res.render(__dirname+"/HTML/admin/afterAdminLogin.html");

    })
});

app.post("/createCustomerID",(req,res)=>{
    const dType=req.body.dType;
    const fname=req.body.fname;
    const mname=req.body.mname;
    const lname=req.body.lname;
    const dob=req.body.dob;
    const email=req.body.email;
    const phno=req.body.phno;
    const address=req.body.addr;
    const pincode=req.body.pincode;
    pool.query(`select count(*) as customer_no from CUSTOMER`,(err,result)=>{
        if(err)
            console.log(err);
        else{
            setValue((result[0].customer_no)+1);
        }    
    });

    function setValue(customer_id){
        customer_id=customer_id.toString();
        while(customer_id.length < 6){
            customer_id='0'+customer_id;
        }
        customer_id="cus"+customer_id;
        
        pool.query(`insert into CUSTOMER values(?,?,?,?,?,?,?,?,?)`,[customer_id,fname,mname,lname,dob,email,phno,address,pincode],(err,result)=>{
            if(err)
                console.log(err);
            else
                console.log(result);
        });
        if(dType == 'vehicle')
            res.render(__dirname+"/HTML/admin/vehicleAndDocumentDetails.html",{token:customer_id});
        else
            res.render(__dirname+"/HTML/admin/addDLDetails.html",{token:customer_id});
    }
});


app.post("/getCustomerID",(req,res)=>{
    // const customer_id='cus123458';
    const dType=req.body.dType;
    const fname=req.body.fname;
    const mname=req.body.mname;
    const lname=req.body.lname;
    const dob=req.body.dob;
    pool.query(`select customer_id from CUSTOMER where fname=? AND mname=? AND lname=? AND dob=?`,[fname,mname,lname,dob],(err,result)=>{
        if(err)
            console.log(err);
        else
        setValue(result[0].customer_id);
    });

    function setValue(customer_id){
        if(dType == "vehicle")
            res.render(__dirname+"/HTML/admin/vehicleAndDocumentDetails.html",{token:customer_id});
        else
            res.render(__dirname+"/HTML/admin/addDLDetails.html",{token:customer_id});
    }
});


app.post("/vehicleAndDocumentDetails",(req,res)=>{
    const customer_id=req.body.customer_id;
    const vehicle_no=req.body.vehicle_no;
    const model=req.body.model;
    const year_of_mfg=req.body.year_of_mfg;
    const chassis_no=req.body.chassis_no;
    const fuel_type=req.body.fuel_type;
    const colour=req.body.colour;
    const vehicle_type=req.body.vehicle_type;
    const regd_date=req.body.regd_date;
    const regd_type=req.body.regd_type;
    const ins_id=req.body.ins_id;
    const ins_start_date=req.body.ins_start_date;
    const ins_end_date=req.body.ins_end_date;
    const puc_id=req.body.puc_id;
    const puc_start_date=req.body.puc_start_date;
    const puc_end_date=req.body.puc_end_date;

    pool.query(`insert into VEHICLE values(?,?,?,?,?,?,?,?)`,[vehicle_no,model,year_of_mfg,chassis_no,fuel_type,colour,customer_id,vehicle_type,null,null],(err,result)=>{
        if(err)
            console.log(err);
        else
            console.log(result);
    });

    pool.query(`select count(*) as document_no from DOCUMENT`,(err,result)=>{
        if(err)
            console.log(err);
        else{
            setValue((result[0].document_no)+1);
        }    
    });

    function setValue(reg_id){
        reg_id=reg_id.toString();
        while(reg_id.length < 6){
            reg_id='0'+reg_id;
        }
        reg_id="reg"+reg_id;
        
        pool.query(`insert into DOCUMENT (reg_id,regd_date,regd_type,ins_id,ins_start_date,ins_end_date,puc_id,puc_start_date,puc_end_date,vehicle_no) values(?,?,?,?,?,?,?,?,?,?)`,[reg_id,regd_date,regd_type,ins_id,ins_start_date,ins_end_date,puc_id,puc_start_date,puc_end_date,vehicle_no],(err,result)=>{
            if(err)
                console.log(err);
            else
                console.log(result);
        });

        res.render(__dirname+"/HTML/admin/successful.html",{token:"Record created successully."});
    }
});

app.post("/addDLDetails",(req,res)=>{
    const customer_id=req.body.customer_id;
    const dl_due_date=req.body.dl_due_date;
    const dl_type=req.body.dl_type;
    pool.query(`select count(*) as document_no from DRIVING_LICENSE`,(err,result)=>{
        if(err)
            console.log(err);
        else{
            setValue((result[0].document_no)+1);
        }    
    });

    function setValue(dl_no){
        dl_no=dl_no.toString();
        while(dl_no.length < 7){
            dl_no='0'+dl_no;
        }
        dl_no="DL"+dl_no;
        
        pool.query(`insert into DRIVING_LICENSE (dl_no, customer_id, dl_due_date) values(?,?,?)`,[dl_no, customer_id,dl_due_date],(err,result)=>{
            if(err)
                console.log(err);
            else
                console.log(result);
        });
        var i=0;
        const typeArray=dl_type.split(",");
        while(typeArray[i]!=null){
            pool.query(`insert into DL_TYPE (dl_no, dl_type) values(?,?)`,[dl_no, typeArray[i]],(err,result)=>{
                if(err)
                    console.log(err);
                else
                    console.log(result);
            });
            i++;
        }
        
        res.render(__dirname+"/HTML/admin/successful.html",{token:"Record created successully."});
    }
});

app.post("/updateDL",(req,res)=>{
    const dl_no=req.body.dl_no;
    const dl_type=req.body.dl_type;
    const dl_due_date=req.body.dl_due_date;
    if(dl_due_date != null){
        pool.query(`update DRIVING_LICENSE set dl_due_date=? where dl_no=?`,[dl_due_date,dl_no],(err,result)=>{
            if(err)
                console.log(err);
            else
                console.log(result);
        });
    }

    if(dl_type != null){
        var i=0;
        const typeArray=dl_type.split(",");
        while(typeArray[i]!=null){
            pool.query(`insert into DL_TYPE (dl_no, dl_type) values(?,?)`,[dl_no, typeArray[i]],(err,result)=>{
                if(err)
                    console.log(err);
                else
                    console.log(result);
            });
            i++;
        }
    }
    res.render(__dirname+"/HTML/admin/successful.html",{token:"Record updated successully."});
});

app.post("/updateDocument",(req,res)=>{
    const vehicle_no = req.body.vehicle_no;
    const udType = req.body.udType;
    
    if(udType == "ins"){
        const ins_id=req.body.ins_id;
        const ins_start_date = req.body.ins_start_date;
        const ins_end_date = req.body.ins_end_date;
        pool.query(`update DOCUMENT set ins_id=?, ins_start_date=?, ins_end_date=? where vehicle_no=?`,[ins_id,ins_start_date,ins_end_date,vehicle_no],(err,result)=>{
            if(err)
                console.log(err);
            else{
                res.render(__dirname+"/HTML/admin/successful.html",{token:"Document updated successfully."});
            }
        })
    }
    else if(udType == "puc"){
        const puc_id=req.body.puc_id;
        const puc_start_date = req.body.puc_start_date;
        const puc_end_date = req.body.puc_end_date;
        pool.query(`update DOCUMENT set puc_id=?, puc_start_date=?, puc_end_date=? where vehicle_no=?`,[puc_id,puc_start_date,puc_end_date,vehicle_no],(err,result)=>{
            if(err)
                console.log(err);
            else{
                res.render(__dirname+"/HTML/admin/successful.html",{token:"Document updated successfully."});
            }
        })
    }
})




                                    // USER


                                    
app.post("/userLogin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    pool.query(`select password from LOGIN where username=?`,[username],(err,result)=>{
        if(err)
            console.log(err);
        
        else if(result[0] == null || result[0].password !== password)
            res.render(__dirname+"/HTML/user/userLogin.html",{token:"Invalid username or password."});
        
        else
            res.render(__dirname+"/HTML/user/afterUserLogin.html");

    })
});


app.post("/getVehicleDetails",(req,res)=>{
    const vehicle_no=req.body.vehicle_no;
    pool.query(`select vehicle_no,model,year_of_mfg,chassis_no,fuel_type,colour from VEHICLE where vehicle_no=?`,[vehicle_no],(err,result)=>{
        if(result[0]==null)
            res.render(__dirname+"/HTML/error",{token:"Please enter correct vehicle number"});
        else{
            // console.log(result);
            res.render(__dirname+"/HTML/user/sendVehicleDetails.html",{token1:result[0].vehicle_no,token2:result[0].model,token3:result[0].year_of_mfg,token4:result[0].chassis_no,token5:result[0].fuel_type,token6:result[0].colour});
        }    
    });
})


app.post("/getOwnerDetails",(req,res)=>{
    const vehicle_no=req.body.vehicle_no;
    pool.query(`select fname,mname,lname,dob,email,phno,address,pincode from CUSTOMER c ,VEHICLE v where v.vehicle_no=? AND v.customer_id=c.customer_id;
    `,[vehicle_no],(err,result)=>{
        if(result[0]==null)
            res.render(__dirname+"/HTML/error",{token:"Please enter correct vehicle number"});
        else{
            const dob=JSON. stringify(result[0].dob).slice(1,11);
            res.render(__dirname+"/HTML/user/sendOwnerDetails.html",{token1:vehicle_no,token2:result[0].fname,token3:result[0].mname,token4:result[0].lname,token5:dob,token6:result[0].phno,token7:result[0].email,token8:result[0].address,token9:result[0].pincode});
        }    
    });
})


app.post("/getDLDetails",(req,res)=>{
    const dl_no=req.body.dl_no;
    pool.query(`select dl.dl_no, c.fname, c.mname, c.lname, c.phno, c.address, dt.dl_type from CUSTOMER c, DRIVING_LICENSE dl, DL_TYPE dt where dl.dl_no=? AND c.customer_id=dl.customer_id AND dt.dl_no=dl.dl_no;`,[dl_no],(err,result)=>{
        // if(result[0]==null)
        //     res.render(__dirname+"/HTML/error",{token:"Please enter correct vehicle number"});
        // else{
        //     // console.log(result);
        //     res.render(__dirname+"/HTML/user/sendOwnerDetails.html",{token1:vehicle_no,token2:result[0].fname,token3:result[0].mname,token4:result[0].lname,token5:result[0].dob,token6:result[0].phno,token7:result[0].email,token8:result[0].address,token9:result[0].pincode});
        // }    
        console.log(result);
    });
})


app.post("/addMissingVehicle",(req,res)=>{
    const vehicle_no=req.body.vehicle_no;
    const missing_date=req.body.missing_date;
    const missing_place=req.body.missing_place;
    pool.query(`select customer_id from VEHICLE where vehicle_no=?`,[vehicle_no],(err,result)=>{
        if(err)
        // console.log(result);
            res.render(__dirname+"/HTML/error.html",{token:"Vehicle Number does not exist."});
        else   
            setValues(result[0].customer_id);
            // console.log(result[0].customer_id);
    });
    function setValues(customer_id){
        pool.query(`insert into MISSING_VEHICLE values(?,?,?,?)`,[vehicle_no,customer_id,missing_date,missing_place],(err,result)=>{
            if(err)
                res.render(__dirname+"/HTML/error.html",{token:"Error in adding data."});
            else
                res.render(__dirname+"/HTML/user/successful.html",{token:"Added successfully. We will inform you if we found any information about your vehicle."});
        });
    }
});



// API

app.get("/getDetails/vehicleno/:vno",(req,res)=>{
    pool.query('select * from DOCUMENT where vehicle_no=?',[req.params.vno],(err,result)=>{
        if(err)
            res.send("Vehicle details not found");
        else
            res.send(result);
    })
});

app.get("/getPhno/vehicleno/:vno",(req,res)=>{
    vehicle_no=req.params.vno
    pool.query(`select c.phno from CUSTOMER c, VEHICLE v where c.customer_id=v.customer_id and v.vehicle_no=?`,[vehicle_no],(err,result)=>{
        if(err)
            res.send(err)
        else    
            res.send(result)
    })
});

app.post("/addNotifiedDate/:date/vehicleno/:vno",(req,res)=>{
    notified_date=req.params.date
    if(notified_date == 'null')
        notified_date=null;
    vehicle_no=req.params.vno
    pool.query(`update DOCUMENT set notified_date=? where vehicle_no=?`,[notified_date,vehicle_no],(err,result)=>{
        if(err)
            res.send(err)
        else
            res.send("Added successfully")
    })
})


app.get("/background-images/1706697.jpg",(req,res)=>{
    res.sendFile(__dirname+"/background-images/1706697.jpg")
});

app.get("/background-images/img2.jpg",(req,res)=>{
    res.sendFile(__dirname+"/background-images/img2.jpg")
});

app.get("/background-images/img5.jpg",(req,res)=>{
    res.sendFile(__dirname+"/background-images/img5.jpg")
});

app.listen(3000,function(){
    console.log("Server is running on port 3000...");
});







