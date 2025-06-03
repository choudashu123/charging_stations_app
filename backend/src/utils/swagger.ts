import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Charging Station API',
      version: '1.0.0',
      description: 'API for managing EV charging stations',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // location of your route files
};

const swaggerSpec = swaggerJsDoc(options);

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
