// node-geocoder is used to convert addresses into geographic coordinates (and vice-versa)
const nodeGeocoder = require('node-geocoder');
const config = require('./config');

// Configuration options for node-geocoder
// These options determine which API (provider) to use, the protocol for API requests (httpAdapter), 
// API credentials (apiKey), and optional response formatting (formatter)
const options = {
    // The provider for geocoding services, specified in environment variables
    provider: config.geocoder_provider,

    // Specify the protocol to use for sending requests to the geocoding provider
    // 'https' is commonly used for secure API requests
    httpAdapter: 'https',

    // API key for the geocoding provider, stored in environment variables
    apiKey: config.geocoder_api_key,

    // Formatter is used to format the response from the geocoding provider.
    // It is set to null to use the default format provided by the geocoding service.
    formatter: null 
}

// Create a geocoder instance with the specified options
// This instance will be used to interact with the geocoding provider and perform geocoding operations
const geocoder = nodeGeocoder(options);


module.exports = geocoder;