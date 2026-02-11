const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Client Service API",
    version: "1.0.0",
    description: "Client payment and validation endpoints."
  },
  servers: [
    {
      url: "http://localhost:4003",
      description: "Local development"
    }
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Clients", description: "Client payment and validation" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": { description: "Service health" }
        }
      }
    },
    "/api/clients/payment/execute/vendor": {
      post: {
        tags: ["Clients"],
        summary: "Execute vendor payment",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { type: "object" } }
          }
        },
        responses: { "200": { description: "Payment executed" } }
      }
    },
    "/api/clients/validation/validate/vendor": {
      post: {
        tags: ["Clients"],
        summary: "Validate vendor",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { type: "object" } }
          }
        },
        responses: { "200": { description: "Vendor validated" } }
      }
    }
  }
};

export default openapi;
