const express = require ("express");
const mysql = require ("mysql");

const dbconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "landmarketplace"
})

const app = express()
app.use(express.static("public")) // static files
app.get("/", (req,res)=>{
    // home page/route/path
    res.render("home.ejs");
});

app.get("/listings", (req,res)=>{
    // all listings route
    
    dbconnection.query("SELECT * FROM land_properties LEFT JOIN property_images ON land_properties.property_id = property_images.property_id", (sqlErr, listings)=>{
        if(sqlErr){
            console.log(sqlErr);
            
            res.send("Server Error!!")
        }else{
            console.log(listings);
            res.render("listings.ejs", {listings})
        }
    })
   
});

app.get("/listing", (req,res)=>{
    // single listing route
    
    dbconnection.query("SELECT * FROM land_properties LEFT JOIN property_images ON land_properties.property_id = property_images.property_id JOIN agent_id ON land_properties.agent_id = agents.agent_id ", (sqlErr, listing)=>{
        if(sqlErr){
            console.log(sqlErr);
            
            res.send("Server Error!!")
        }else{
            console.log(listing);
            res.render("listing.ejs", {listing})
        }
    })
   
});


// other routes
app.get("*", (req,res) =>{
    // 404 page
    res.status(404).render("404.ejs");
});
// start your application - using a network port
app.listen(5100);