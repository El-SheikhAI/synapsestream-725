# Authentication Guide for SynapseStream APIs

## 1. Introduction  
Authentication is mandatory for all SynapseStream API endpoints. The framework supports two primary authentication methods:  

1. **OAuth 2.0** (Recommended for production systems)  
2. **API Keys** (Suitable for development/testing)  

All requests must be made over HTTPS. Unauthenticated requests will return `401 Unauthorized`.  

---

## 2. OAuth 2.0 Authentication  

### 2.1 Obtaining Credentials  
Register your application in the SynapseStream Developer Portal to obtain:  
- `client_id`  
- `client_secret`  
- `redirect_uri`  

### 2.2 Requesting Access Token  
Use the **Client Credentials Flow** for server-to-server communication:  

```bash
curl -X POST "https://api.synapsestream.io/oauth2/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials" \
     -d "client_id=your_client_id" \
     -d "client_secret=your_client_secret" \
     -d "scope=inference%20training"
```

### 2.3 Token Response  
Successful response contains:  
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "inference training"
}
```

### 2.4 Using Access Tokens  
Include the token in subsequent requests:  
```bash
curl -X GET "https://api.synapsestream.io/v1/models" \
     -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Note**: Tokens expire after `expires_in` seconds. Implement token refresh logic using the same token endpoint.  

---

## 3. API Key Authentication  

### 3.1 Generating API Keys  
1. Navigate to **Security > API Keys** in the SynapseStream Dashboard  
2. Click "Generate New Key"  
3. Store the generated key securely  

### 3.2 Using API Keys  
Include the key in request headers:  
```bash
curl -X POST "https://api.synapsestream.io/v1/data/stream" \
     -H "X-API-Key: sk_live_1a2b3c4d5e6f7g8h9i0j" \
     -H "Content-Type: application/json" \
     -d '{"stream_id": "nn-435X", "data": [...]}'
```

**Security Considerations**:  
- Rotate keys every 90 days  
- Never commit keys to version control  
- Restrict keys to specific IP ranges when possible  

---

## 4. Token Refresh Mechanism  

### 4.1 Refresh Token Request  
Using the OAuth 2.0 refresh token flow:  
```bash
curl -X POST "https://api.synapsestream.io/oauth2/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=refresh_token" \
     -d "client_id=your_client_id" \
     -d "client_secret=your_client_secret" \
     -d "refresh_token=your_refresh_token"
```

### 4.2 Refresh Response  
```json
{
  "access_token": "new_access_token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "new_refresh_token"
}
```

---

## 5. Error Codes  

| Code | Error                | Resolution                         |
|------|----------------------|------------------------------------|
| 401  | Invalid credentials  | Verify client ID/secret or API key |
| 403  | Insufficient scope   | Request appropriate OAuth scopes   |
| 418  | Token expired        | Refresh access token               |
| 429  | Rate limit exceeded  | Implement exponential backoff      |

---

## 6. Best Practices  
1. Use OAuth 2.0 for production workloads  
2. Set token expiration to ≤1 hour in high-security environments  
3. Validate all JWT signatures using our [public JWKS endpoint](https://api.synapsestream.io/.well-known/jwks.json)  
4. Implement circuit breakers for authentication failures  