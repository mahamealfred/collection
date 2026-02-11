const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Account Service API",
    version: "1.0.0",
    description: "Account service endpoints for balances, history, and top-ups."
  },
  servers: [
    {
      url: "http://localhost:4002",
      description: "Local development"
    }
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Accounts", description: "Account operations" }
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
    "/api/agency/accounts/client-topup": {
      post: {
        tags: ["Accounts"],
        summary: "Client MoMo top up",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" }
            }
          }
        },
        responses: {
          "200": { description: "Top up processed" }
        }
      }
    },
    "/api/agency/accounts/main/balance": {
      get: {
        tags: ["Accounts"],
        summary: "Get main account balance",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Account balance" }
        }
      }
    },
    "/api/agency/accounts/all/accounts/info/balance": {
      get: {
        tags: ["Accounts"],
        summary: "Get all accounts balance",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Accounts balance" }
        }
      }
    },
    "/api/agency/accounts/main/account/history": {
      get: {
        tags: ["Accounts"],
        summary: "Get main account history",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Account history" }
        }
      }
    },
    "/api/agency/accounts/self-serve/withdrawals/commissions": {
      post: {
        tags: ["Accounts"],
        summary: "Withdraw commissions",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" }
            }
          }
        },
        responses: {
          "200": { description: "Commission withdrawal processed" }
        }
      }
    }
  }
};

export default openapi;
