/**
 * Create and export configuration variables
 */

// Containers for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3000,
    'envName': 'staging'
};

// Production environment
environments.production  = {
    'httpPort': 5000,
    'envName': 'production'
};

// Determine which environment was passed as
// command-line argument
const currentEnvironment = (typeof process.env.NODE_ENV === 'string')
                            ? process.env.NODE_ENV.toLowerCase(): '';
// Check that the current environment is one of the environments above,
// if not, default staging
const environmentToExport = (typeof environments[currentEnvironment] === 'object')
                ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;