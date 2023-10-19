const express=require("express")

const app=express();

app.get("/",(req,res)=>{
    res.status(200).send({msg:"hello world"})
})

app.get("/:name",(req,res)=>{
    res.status(200).send({msg:`hello world ${req.params.name}`})
})

const PORT=5001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})