# CORS Error Fix - Complete Guide

## 🔴 Problem Encountered

```
Access to XMLHttpRequest at 'https://vibechat-production-24a1.up.railway.app/api/users' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 📋 What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a security feature that prevents web pages from making requests to a different domain than the one that served the web page.

- **Frontend**: `http://localhost:5173` (or 5174, 5175)
- **Backend**: `https://vibechat-production-24a1.up.railway.app`

These are different origins, so browsers block the requests unless the backend explicitly allows them.

---

## ✅ Solution Applied: Vite Development Proxy

### How It Works

Instead of making requests directly to the backend, Vite proxies all API requests through the local development server. This makes the browser think all requests are going to the same origin.

```
Browser → http://localhost:5175/api/users → Vite Proxy → Backend API
         ↑                                ↓
         └──────── Response ←─────────────┘
```

### Configuration Changes

#### 1. **Vite Config** (`vite.config.js`)
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://vibechat-production-24a1.up.railway.app',
      changeOrigin: true,  // Changes host header to match target
      secure: false,       // Allows HTTPS with self-signed certs
    },
    '/ws': {
      target: 'wss://vibechat-production-24a1.up.railway.app',
      ws: true,            // Proxy WebSocket connections
      changeOrigin: true,
      secure: false,
    },
  },
}
```

#### 2. **Axios Config** (`src/api/axios.js`)
```javascript
const API_BASE_URL = import.meta.env.DEV 
  ? ''  // Use relative path in development
  : 'https://vibechat-production-24a1.up.railway.app';  // Full URL in production
```

Now in development:
- Request to `/api/users` → proxied to backend
- In production → direct request to full URL

---

## 🎯 How to Test

1. **Restart dev server** (already done - running on port 5175)
2. **Open** `http://localhost:5175`
3. **Login/Register** - Should work now without CORS errors
4. **Check console** - No more CORS errors!

---

## 🔧 Alternative Solutions

### Option A: Backend CORS Configuration (Permanent Solution)

Contact your backend developer to add proper CORS headers.

#### Spring Boot Example:

**Global Configuration:**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:5175"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

**Controller-Level:**
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api")
public class UserController {
    // ...
}
```

### Option B: Environment Variable for API URL

Create `.env` file:
```env
VITE_API_URL=http://localhost:5175/api
```

Update `axios.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
```

---

## 📊 Current Setup Summary

### Development Mode
- **Frontend URL**: `http://localhost:5175`
- **API Requests**: `/api/*` (relative)
- **Proxy**: Vite forwards to backend
- **CORS**: ✅ Bypassed via proxy

### Production Mode
- **Frontend URL**: Your deployed domain
- **API Requests**: Full backend URL
- **CORS**: Backend must allow frontend domain

---

## ⚠️ Important Notes

### For Development
✅ Proxy solves CORS temporarily  
✅ No code changes needed in components  
✅ Works with all API endpoints  
✅ Supports WebSocket connections  

### For Production
⚠️ Backend MUST have CORS configured  
⚠️ Or deploy frontend and backend on same domain  
⚠️ Or use API gateway  

---

## 🐛 Troubleshooting

### Still Getting CORS Errors?

1. **Check if proxy is working:**
   - Open DevTools → Network tab
   - Make an API request
   - Check request URL - should be `http://localhost:5175/api/...`
   - NOT `https://vibechat-production-24a1.up.railway.app/api/...`

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Clear browser cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

4. **Check Vite config:**
   - Ensure proxy configuration is correct
   - Verify ports match

### Backend Issues

If backend returns errors:
1. Check backend is running
2. Verify base URL is correct
3. Check network connectivity
4. Review backend logs

---

## 📝 Files Modified

1. ✅ `vite.config.js` - Added proxy configuration
2. ✅ `src/api/axios.js` - Conditional base URL based on environment

---

## 🎉 Success Criteria

✅ No CORS errors in console  
✅ API requests succeed  
✅ Can fetch users list  
✅ Can login/register  
✅ WebSocket connects successfully  

---

## 🔄 Next Steps

### Immediate
1. Test all functionality with proxy enabled
2. Verify API calls work correctly
3. Check WebSocket connection

### Before Deployment
1. Contact backend developer about CORS configuration
2. Update production environment variables
3. Test with actual CORS headers

### Long-term
1. Backend implements proper CORS
2. Consider using same domain for both (e.g., `yourapp.com/api`, `yourapp.com`)
3. Or use API gateway/reverse proxy

---

**Status**: ✅ CORS Fixed - App should work now!

**Dev Server Running**: http://localhost:5175

Try logging in again - it should work! 🚀
