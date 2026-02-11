const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Identity Service API",
    version: "1.0.0",
    description: "Authentication and user identity endpoints."
  },
  servers: [
    {
      url: "http://localhost:4004",
      description: "Local development"
    }
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Auth", description: "Authentication and identity" }
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
    "/api/agency/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { type: "object" } }
          }
        },
        responses: { "200": { description: "User registered" } }
      }
    },
    "/api/agency/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { type: "object" } }
          }
        },
        responses: { "200": { description: "Login successful" } }
      }
    },
    "/api/agency/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { type: "object" } }
          }
        },
        responses: { "200": { description: "Token refreshed" } }
      }
    },
    "/api/agency/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Logout successful" } }
      }
    },
    "/api/agency/auth/find/{user}": {
      get: {
        tags: ["Auth"],
        summary: "Find user by identifier",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "user",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: { "200": { description: "User found" } }
      }
    },
    "/api/agency/auth/agents/register": {
      post: {
        tags: ["Auth"],
        summary: "Register agent",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { type: "object" } }
          }
        },
        responses: { "200": { description: "Agent registered" } }
      }
    }
  }
};

export default openapi;
