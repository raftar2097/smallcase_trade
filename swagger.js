const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.js'
const endpointsFiles = ['./server/api.js']

swaggerAutogen(outputFile, endpointsFiles);