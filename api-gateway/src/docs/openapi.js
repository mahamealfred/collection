const openapi = {
  openapi: "3.0.3",
  info: {
    title: "API Gateway",
    version: "1.0.0",
    description: "API Gateway routes and proxy endpoints."
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development"
    }
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Gateway", description: "Gateway proxy routes" }
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
          "200": { description: "Gateway health" }
        }
      }
    },
    "/v1/agency/auth": {
      post: {
        tags: ["Gateway"],
        summary: "Proxy to identity service",
        responses: {
          "200": { description: "Proxy response" }
        }
      }
    },
    "/v1/agency/accounts": {
      get: {
        tags: ["Gateway"],
        summary: "Proxy to account service",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Proxy response" }
        }
      }
    },
    "/v1/clients/payment": {
      post: {
        tags: ["Gateway"],
        summary: "Proxy to client service",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Proxy response" }
        }
      }
    },
    "/v1/clients/validation": {
      post: {
        tags: ["Gateway"],
        summary: "Proxy to client service validation",
        responses: {
          "200": { description: "Proxy response" }
        }
      }
    },
    "/v1/collection": {
      post: {
        tags: ["Gateway"],
        summary: "Proxy to collection service",
        responses: {
          "200": { description: "Proxy response" }
        }
      }
    },
    "/v1/thirdparty/collection": {
      post: {
        tags: ["Gateway"],
        summary: "Proxy to collection service (third party)",
        responses: {
          "200": { description: "Proxy response" }
        }
      }
    },
    "/v1/agencytest": {
      post: {
        tags: ["Gateway"],
        summary: "Proxy to test service",
        responses: {
          "200": { description: "Proxy response" }
        }
      }
    }
  }
};

export default openapi;
