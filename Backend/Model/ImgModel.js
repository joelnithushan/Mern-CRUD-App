const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImgSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ImgModel", ImgSchema);
