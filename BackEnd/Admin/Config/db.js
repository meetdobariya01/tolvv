const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Make sure this is called before using process.env

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));
