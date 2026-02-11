const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Agency Service API",
    version: "1.0.0",
    description: "Agency banking, billing, and reporting endpoints."
  },
  servers: [
    {
      url: "http://localhost:4001",
      description: "Local development"
    }
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Agency", description: "Agency banking operations" },
    { name: "EcoBank", description: "EcoBank billing operations" },
    { name: "Reports", description: "Reporting endpoints" }
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
        responses: { "200": { description: "Service health" } }
      }
    },
    "/api/agency/thirdpartyagency/services/getbalance": {
      get: {
        tags: ["Agency"],
        summary: "Get agency account balance",
        responses: { "200": { description: "Balance result" } }
      }
    },
    "/api/agency/thirdpartyagency/services/validateidentity": {
      post: {
        tags: ["Agency"],
        summary: "Validate identity",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Identity validated" } }
      }
    },
    "/api/agency/thirdpartyagency/services/getcustomerdetails": {
      post: {
        tags: ["Agency"],
        summary: "Get customer details",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Customer details" } }
      }
    },
    "/api/agency/thirdpartyagency/services/validate/cash-token": {
      post: {
        tags: ["Agency"],
        summary: "Validate cash token",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Token validated" } }
      }
    },
    "/api/agency/thirdpartyagency/services/account-openning": {
      post: {
        tags: ["Agency"],
        summary: "Open account",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Account opened" } }
      }
    },
    "/api/agency/thirdpartyagency/services/execute/cash-in": {
      post: {
        tags: ["Agency"],
        summary: "Execute cash-in",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Cash-in executed" } }
      }
    },
    "/api/agency/thirdpartyagency/services/execute/withdraw": {
      post: {
        tags: ["Agency"],
        summary: "Execute cash-out",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Cash-out executed" } }
      }
    },
    "/api/agency/thirdpartyagency/services/execute/redeemtoken": {
      post: {
        tags: ["Agency"],
        summary: "Redeem cash token",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Token redeemed" } }
      }
    },
    "/api/agency/thirdpartyagency/services/validate/biller": {
      post: {
        tags: ["Agency"],
        summary: "Validate biller",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Biller validated" } }
      }
    },
    "/api/agency/thirdpartyagency/services/execute/bill-payment": {
      post: {
        tags: ["Agency"],
        summary: "Execute bill payment",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Bill payment executed" } }
      }
    },
    "/api/agency/thirdpartyagency/services/execute/bulk-sms": {
      post: {
        tags: ["Agency"],
        summary: "Execute bulk SMS payment",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Bulk SMS payment executed" } }
      }
    },
    "/api/agency/thirdpartyagency/services/execute/single-sms": {
      post: {
        tags: ["Agency"],
        summary: "Execute single SMS payment",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Single SMS payment executed" } }
      }
    },
    "/api/agency/eco/services/validate/biller": {
      post: {
        tags: ["EcoBank"],
        summary: "Validate EcoBank biller",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "EcoBank biller validated" } }
      }
    },
    "/api/agency/eco/services/biller-details": {
      post: {
        tags: ["EcoBank"],
        summary: "Get EcoBank biller details",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Biller details" } }
      }
    },
    "/api/agency/eco/services/agent-billers": {
      get: {
        tags: ["EcoBank"],
        summary: "Get EcoBank agent billers",
        responses: { "200": { description: "Billers list" } }
      }
    },
    "/api/agency/eco/services/bill-payment-fee": {
      post: {
        tags: ["EcoBank"],
        summary: "Get bill payment fee",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Payment fee" } }
      }
    },
    "/api/agency/eco/services/execute-bill-payment": {
      post: {
        tags: ["EcoBank"],
        summary: "Execute EcoBank bill payment",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Bill payment executed" } }
      }
    },
    "/api/agency/thirdpartyagency/services/billers/details": {
      get: {
        tags: ["Agency"],
        summary: "Get billers details",
        responses: { "200": { description: "Billers details" } }
      }
    },
    "/api/agency/thirdpartyagency/services/transaction/details/{id}": {
      get: {
        tags: ["Agency"],
        summary: "Get transaction details",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: { "200": { description: "Transaction details" } }
      }
    },
    "/api/agency/thirdpartyagency/services/transactions/history": {
      get: {
        tags: ["Agency"],
        summary: "Get transaction history",
        responses: { "200": { description: "Transaction history" } }
      }
    },
    "/api/agency/thirdpartyagency/services/transactions/history/{brokerId}/broker": {
      get: {
        tags: ["Agency"],
        summary: "Get broker transaction history",
        parameters: [
          { name: "brokerId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: { "200": { description: "Broker transactions" } }
      }
    },
    "/api/agency/thirdpartyagency/services/tariffs": {
      get: {
        tags: ["Agency"],
        summary: "Get tariffs",
        responses: { "200": { description: "Tariffs" } }
      }
    },
    "/api/agency/thirdpartyagency/services/tariffs/bill": {
      get: {
        tags: ["Agency"],
        summary: "Get bill tariffs",
        parameters: [
          { name: "type", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: { "200": { description: "Bill tariffs" } }
      }
    },
    "/api/agency/thirdpartyagency/services/tariffs/rapidtransfer": {
      get: {
        tags: ["Agency"],
        summary: "Get rapid transfer tariffs",
        parameters: [
          { name: "type", in: "query", required: true, schema: { type: "string" } }
        ],
        responses: { "200": { description: "Rapid transfer tariffs" } }
      }
    },
    "/api/reports/stats/hourly": {
      get: {
        tags: ["Reports"],
        summary: "Get hourly stats",
        responses: { "200": { description: "Hourly stats" } }
      }
    },
    "/api/reports/stats/daily": {
      get: {
        tags: ["Reports"],
        summary: "Get daily stats",
        responses: { "200": { description: "Daily stats" } }
      }
    },
    "/api/reports/stats/custom": {
      get: {
        tags: ["Reports"],
        summary: "Get custom stats",
        parameters: [
          { name: "startDate", in: "query", required: true, schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", required: true, schema: { type: "string", format: "date" } }
        ],
        responses: { "200": { description: "Custom stats" } }
      }
    },
    "/api/reports/failed/hourly": {
      get: {
        tags: ["Reports"],
        summary: "Get failed hourly transactions",
        parameters: [
          { name: "limit", in: "query", required: false, schema: { type: "integer" } }
        ],
        responses: { "200": { description: "Failed hourly transactions" } }
      }
    },
    "/api/reports/failed/daily": {
      get: {
        tags: ["Reports"],
        summary: "Get failed daily transactions",
        parameters: [
          { name: "limit", in: "query", required: false, schema: { type: "integer" } }
        ],
        responses: { "200": { description: "Failed daily transactions" } }
      }
    },
    "/api/reports/send/manual": {
      post: {
        tags: ["Reports"],
        summary: "Send report manually",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "Report sent" } }
      }
    },
    "/api/reports/preview/hourly": {
      get: {
        tags: ["Reports"],
        summary: "Preview hourly report",
        responses: { "200": { description: "Hourly report preview" } }
      }
    },
    "/api/reports/preview/daily": {
      get: {
        tags: ["Reports"],
        summary: "Preview daily report",
        responses: { "200": { description: "Daily report preview" } }
      }
    }
  }
};

export default openapi;
