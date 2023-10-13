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

// Define a static method on the CourseSchema.statics object.
// This method calculates the average cost of courses for a specific bootcamp.
CourseSchema.statics.getAvgCost = async function (bootcampId){
  
  // Perform an aggregation pipeline operation in MongoDB via Mongoose.
  // This pipeline will consist of several stages to transform the course documents into aggregated results.
  const obj = await this.aggregate([
    {
      // Stage 1: $match
      // Filter the documents to pass to the next stage in the pipeline
      // Only documents related to the provided bootcampId will be allowed through.
      $match: {bootcamp: bootcampId}
    },
    {
      // Stage 2: $group
      // Group input documents by the specified "_id" expression and for each distinct grouping, 
      // output a document. Here, grouping by "bootcamp" field and calculating the average "tuition".
      $group: {
        _id: "$bootcamp",
        averageCost: {$avg: "$tuition"}
      }
    }
  ])
  
  try {
    // Update the related Bootcamp document with the calculated average cost.
    // 'Math.ceil(obj[0].averageCost/10)*10': Round up the average to the nearest 10.
    // 'this.model("Bootcamp")' accesses the Bootcamp model from the Course model context.
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost/10)*10
    })
  } catch (error) {
    // Log the error in the console if an error occurs during the update operation.
    console.error(error)
  }
}

// Middleware: Execute After Saving a Course Document
CourseSchema.post("save", function () {
  // Re-calculate the average cost after a course document is saved.
  // 'this.constructor': Refers to the model that created the instance (Course model).
  // 'this.bootcamp': Refers to the bootcampId of the current course instance.
  this.constructor.getAvgCost(this.bootcamp);
});

// Middleware: Execute Before Removing a Course Document
CourseSchema.pre("remove", function () {
  // Re-calculate the average cost just before a course document is removed.
  // Ensuring that the average cost remains accurate even after course removal.
  this.constructor.getAvgCost(this.bootcamp);
});



module.exports = mongoose.model("Course", CourseSchema);