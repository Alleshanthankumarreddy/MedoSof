import mongoose from 'mongoose'

const rackSchema = new mongoose.Schema({
  rackNumber: { type: String, required: true, unique: true },
  locationDescription: { type: String }
}, { timestamps: true })

const rackModel = mongoose.models.Rack || mongoose.model("Rack", rackSchema)

export default rackModel