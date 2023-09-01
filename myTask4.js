let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET","POST","OPTIONS","PUT","PATCH","DELETE","HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});
const port=2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
let {custData}=require("./custData.js");
let fs=require("fs");
let fname="customers.json";
app.get("/resetData",function(req,res){
    let data=JSON.stringify(custData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    })
})
app.get("/customers",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let custArr=JSON.parse(data);
            res.send(custArr);
        } 
    })
})
app.post("/customers",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let custArr=JSON.parse(data);
            let newCust={...body};
            custArr.push(newCust);
            let data1=JSON.stringify(custArr);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(newCust);
            })
        }
    })
})
app.put("/customers/:id",function(req,res){
    let body=req.body;
    let id=req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let custArr=JSON.parse(data);
            let index=custArr.findIndex((n)=>n.id===id);
            if(index>=0){
                let updated={...custArr[index],...body};
                custArr[index]=updated;
                let data1=JSON.stringify(custArr);
                fs.writeFile(fname,data1,function(err){
                    if(err) console.log(err);
                    else res.send(updated);
                })
            }
            else res.status(404).send("No customer found");
        }
    })
})
app.delete("/customers/:id",function(req,res){
    let id=req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let custArr=JSON.parse(data);
            let index=custArr.findIndex((n)=>n.id===id);
            if(index>=0){
                let deleted=custArr.splice(index,1);
               let data1=JSON.stringify(custArr);
                fs.writeFile(fname,data1,function(err){
                    if(err) console.log(err);
                    else res.send(deleted);
                })
            }
            else res.status(404).send("No customer found");
        }
    })
})
