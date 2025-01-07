const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapasync.js");
const ExpressError= require("../utils/ExpressError.js");
const{listingSchema, reviewSchema}= require("../schema.js");
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });
  

router.route("/")
.get( wrapAsync(listingController.index))

.post( isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createRoute)
);

//NEW
router.get("/new", isLoggedIn,listingController.listingNewroute);


router.route("/:id")
.get( wrapAsync(listingController.showRoute))
.put( isLoggedIn, isOwner,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateRoute))
    .delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyRoute ));

    //edit
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

// router.get("/:id/edit", (req, res) => {
//     res.send("Edit route reached!");
//   });

module.exports=router;