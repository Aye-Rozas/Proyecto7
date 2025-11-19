const mongoose= require("mongoose");

const connectDB = async () => {
try { 
  await mongoose.connect(process.env.DB_URL)
  console.log("BBDD funciona");
  
} catch (error) {
  console.log("Error conectando con la BBDD", error);
  
}
}
module.exports={ connectDB};