const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

// Static method to get average tuition cost for a bootcamp
CourseSchema.statics.getAvgCost = async function (bootcampId){  
  const obj = await this.aggregate([
    {
      // Matching all documents related to the provided bootcampId
      $match: {bootcamp: bootcampId}
    },
    {
      // Grouping results by bootcamp id and calculating the average cost
      $group: {
        _id: "$bootcamp",
        averageCost: {$avg: "$tuition"}
      }
    }
  ])
  try {
    // Updating the related Bootcamp's averageCost field with the calculated average cost
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost/10)*10
    })
  } catch (error) {
    console.error(error)
  }
}

// Middleware: Execute after saving a course document
CourseSchema.post("save", function () {
  // Re-calculating the average cost after saving a new course
  this.constructor.getAvgCost(this.bootcamp);
});

// Middleware: Execute before removing a course document
CourseSchema.pre("remove", function () {
  // Re-calculating the average cost after a course is removed
  this.constructor.getAvgCost(this.bootcamp);
});


module.exports = mongoose.model("Course", CourseSchema);