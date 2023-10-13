const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");
const slugify = require("slugify");
const colors = require('colors');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      // eslint-disable-next-line no-useless-escape
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      // eslint-disable-next-line no-useless-escape
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],

    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  // Enabling virtuals for JSON and Object form so that
  // they are included when a result is converted and sent as response.
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to create a URL slug for the bootcamp before saving to the database
// This will run before the data is saved ("pre-save") and generates a slug from the name field.
BootcampSchema.pre("save", function (next) {
  // Using slugify to convert the name into a URL-friendly string
  // and setting it on the slug field of the model.
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Middleware to translate an address into geographical coordinates using geocoding
// and set up other location-related fields before saving to the database.
BootcampSchema.pre('save', async function(next) {
  // Using the geocoder to convert the address into geographical and other locational data.
  const loc = await geocoder.geocode(this.address);

  // Setting up the location field with the geocoded data,
  // adding various fields like coordinates, city, state, etc.
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  // Not saving the original address field in DB to avoid redundancy
  // as we already have a comprehensive location field.
  this.address = undefined;
  next();
});

// Middleware: Cascade delete courses when a bootcamp is deleted
// This ensures data integrity by removing related course documents when a bootcamp is deleted,
// avoiding orphaned documents in the database that are linked to a non-existing bootcamp.
BootcampSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`.red.inverse)
  // Using `this.model('Course')` to access the Course model,
  // deleting all courses where the bootcamp field equals the _id of the bootcamp being removed.
  await this.model('Course').deleteMany({ bootcamp: this._id })
  next() // Proceed to the next middleware or actual deletion if there are no more middlewares.
})

// Virtual property to populate Bootcamp with Course(s)
// This sets up a virtual populate to allow referencing documents in other models without actually saving its ObjectId in the bootcamp document.
BootcampSchema.virtual('courses', {
  ref: 'Course',            // Reference to the Course model
  localField:'_id',         // Field in the Bootcamp model
  foreignField: 'bootcamp', // Field in the Course model
  justOne: false            // Indicates that multiple courses can be linked to a bootcamp
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
