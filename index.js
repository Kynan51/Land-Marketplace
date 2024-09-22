const express = require ("express");
const mysql = require ("mysql");

const dbconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "landmarketplace"
})


const app = express();

app.use(express.static("public")); // middleware --- app.use(func) - func will executed on every request
app.use(express.urlencoded({extended: true})) // express urlencoded
app.use((req,res, next)=>{
  console.log("Middleware Function") // authorization -- block some route 
  next() 
})
app.get("/", (req,res)=>{
    // home page/route/path
    res.render("home.ejs");
});

app.get("/listings", (req,res)=>{
    // all listings route
    
    dbconnection.query("SELECT * FROM land_properties JOIN land_images ON land_properties.property_image = land_images.image_id", (sqlErr, listings)=>{
        if(sqlErr){
            res.status(500).render("500.ejs")
            
        }else{
            
            res.render("listings.ejs", {listings})
        }
    })
   
});

app.get("/listing", (req,res)=>{
    // single listing route
    const propertyId = req.params.id;
    const query = `
        SELECT * FROM land_properties 
        JOIN land_images 
        ON land_properties.property_image = land_images.image_id 
        WHERE land_properties.id = ?`;
    
    dbconnection.query("SELECT * FROM land_properties JOIN land_images ON land_properties.property_image = land_images.image_id ", (sqlErr, listing)=>{
        if(sqlErr){
            res.status(500).render("500.ejs")
        }
        if (results.length > 0) {
            const property = results[0]; // Fetch the first result
            res.render('listing', { property: property });
        }else{
            
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