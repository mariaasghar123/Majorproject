const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapasync.js");
const ExpressError= require("../utils/ExpressError.js");
const{listingSchema, reviewSchema}= require("../schema.js");
const Listing=require("../models/listing.js");
const Review= require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor}= require("../middleware.js");
const controllersReview= require("../controllers/review.js");


//review 
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync (controllersReview.createReview));
   //delete review route
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(controllersReview.deleteReview));

   
   module.exports= router;