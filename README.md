{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "REST API",
    "description": ""
  },
  "host": "https://smallcasetrade.herokuapp.com",
  "basePath": "/api",
  "schemes": [
    "http"
  ],
  "paths": {
    "/trade/": {
      "get": {
        "description": "",
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      },
      "post": {
        "description": "",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "stock_symbol": {
                  "example": "any"
                },
                "quantity": {
                  "example": "any"
                },
                "price": {
                  "example": "any"
                },
                "trade_type": {
                  "example": "any"
                }
              }
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/trade/{tradeId}": {
      "get": {
        "description": "",
        "parameters": [
          {
            "name": "tradeId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      },
      "put": {
        "description": "",
        "parameters": [
          {
            "name": "tradeId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "stock_symbol": {
                  "example": "any"
                },
                "quantity": {
                  "example": "any"
                },
                "trade_type": {
                  "example": "any"
                },
                "price": {
                  "example": "any"
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      },
      "delete": {
        "description": "",
        "parameters": [
          {
            "name": "tradeId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/portfolio/": {
      "get": {
        "description": "",
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/portfolio/return": {
      "get": {
        "description": "",
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    }
  }
}
