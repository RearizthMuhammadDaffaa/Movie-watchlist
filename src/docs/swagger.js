import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Watchlist API",
      version: "1.0.0",
      description: "API documentation for Movie Watchlist",
    },

    servers: [
      {
        url: "http://localhost:5001",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // 🔥 tambahkan ini
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };