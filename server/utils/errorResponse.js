// Define a custom error handling class called ErrorResponse
// This class extends the native JavaScript Error class and 
// allows custom error objects with a status code property.
class ErrorResponse extends Error {
    
    // The constructor takes two parameters - a message and a status code
    constructor(message, statusCode) {
        
        // Call the constructor of the superclass Error 
        // with the message parameter to ensure the message 
        // property gets set on the created error object
        super(message);
        
        // Set a custom statusCode property using the provided 
        // statusCode parameter. This allows for custom HTTP 
        // status codes to be included with created error objects.
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;