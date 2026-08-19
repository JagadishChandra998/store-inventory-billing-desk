
import express from "express";
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";



dotenv.config();

connectDB()
.then(() =>{
    app.listen (process.env.PORT || 5000, ()=>{
        console.log (`server is running at port ${process.env.PORT} || 5000`);

    })
})
.catch((error) =>{
    console.error("MONGODB connection fail");
    console.log (error);
})