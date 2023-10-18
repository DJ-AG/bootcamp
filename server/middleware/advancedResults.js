// Define a middleware function named advancedResults.
// It takes a Mongoose model and populate as arguments and returns an asynchronous function
// which processes the HTTP request and response objects.

const advancedResults = (model, populate) => async (req, res, next) => {
  
    // Initialize a query object
    let query;
  
    // Creating a shallow copy of req.query to ensure the original request object is not mutated, 
    // providing a baseline for filtering functionality.
    const reqQuery = { ...req.query };
    console.log(reqQuery.name)
    // Define an array containing query parameters that should be removed 
    // before the database query is constructed.
    const removeFields = ['select', 'sort', 'page', 'limit'];
  
    // Iteratively remove specified fields from the request query copy.
    removeFields.forEach(param => delete reqQuery[param]);

    // Convert the modified query object to a JSON string to enable further manipulation.
    let queryStr = JSON.stringify(reqQuery);
  
    // Replace the filtering operators with the MongoDB-compatible format.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
    // Construct the initial database query by converting the manipulated query string back to JSON.
    query = model.find(JSON.parse(queryStr));
    
    console.log(query)
  
    // Check if specific fields are requested in the query string and 
    // modify the database query to select only those fields.
    if(req.query.select){
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
  
    // Determine the sorting order of the query results based on provided sort parameters.
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Default sorting by createdAt in descending order if no sorting parameter is provided.
      query = query.sort('-createdAt');
    }
    
  
    // Implement pagination: set up variables for page, limit, startIndex, and endIndex.
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Find the total number of documents that match the query.
    const total = await model.countDocuments();
  
    // Modify the query to limit the results to the specified page and limit.
    query = query.skip(startIndex).limit(limit);
  
    // If a populate field is provided, modify the query to include document population.
    if(populate){
      query = query.populate(populate);
    }
  
    // Execute the constructed query and store the results in a variable.
    const results = await query;
  
    // Construct a pagination object to indicate availability of previous and next pages.
    const pagination = {};
    if(endIndex < total){
      pagination.next = { page: page + 1, limit };
    }
    if(startIndex > 0){
      pagination.prev = { page: page - 1, limit };
    }
  
    // Attach the query results to the response object under a new property named "advancedResults".
    // It includes a success status, count of returned documents, pagination details, and the data.
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    }
    
    // Pass control to the next middleware in the stack.
    next();
  }
  
  // Export the advancedResults middleware function, enabling its usage in other modules.
  module.exports = advancedResults;