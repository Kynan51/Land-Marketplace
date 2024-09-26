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

app.get("/listing/:id", (req, res) => {
    // single listing route using property ID from route parameters
    const propertyId = req.params.id; 
    
    console.log("Property ID:", propertyId);

    const query = `
        SELECT * FROM land_properties 
        JOIN land_images 
        ON land_properties.property_image = land_images.image_id 
        WHERE land_properties.land_id = ?`; 
    
    dbconnection.query(query, [propertyId], (sqlErr, listing) => { 
        if (sqlErr) {
            console.error("SQL Error:", sqlErr);
            res.status(500).render("500.ejs"); 
        } else {
            console.log("Query Result:", listing);
            if (listing.length > 0) {
                const property = listing[0]; 
                res.render('listing', { property: property }); 
            } else {
                console.log("No property found for ID:", propertyId); 
                res.render("404.ejs"); // Render a 404 page if no listing is found
            }
        }
    });
});

// other routes
app.get("*", (req,res) =>{
    // 404 page
    res.status(404).render("404.ejs");
});
// start your application - using a network port
app.listen(5100);