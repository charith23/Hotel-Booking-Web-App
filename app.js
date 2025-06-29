const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line for JSON parsing
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Index Route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Internal Server Error");
  }
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create Route
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(400).send("Bad Request");
  }
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    console.error("Error fetching listing for edit:", err);
    res.status(500).send("Internal Server Error");
  }
});


