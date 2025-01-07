const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret:process.env.CLOUD_API_SECREAT,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wonderlust_dev",
      allowedformat: ['PNG',"JPG",'JPEG'],
      
    },
  });

  module.exports={cloudinary,storage};