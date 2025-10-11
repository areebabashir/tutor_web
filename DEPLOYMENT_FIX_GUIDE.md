# 🚀 Production Deployment Fix Guide

## Problem Summary
You're experiencing two critical errors when uploading files in production:
1. **413 Request Entity Too Large** - File uploads blocked by Nginx
2. **CORS Policy Error** - Cross-origin requests not properly configured

## ✅ Backend Changes (Already Applied)
The following backend changes have been made:
- ✓ Increased Express body parser limit to 100MB
- ✓ Enhanced CORS configuration with dynamic origin checking
- ✓ Added explicit OPTIONS handler for preflight requests
- ✓ Increased Multer upload limit to 100MB

## 🔧 Server Configuration Required

### Step 1: SSH into Your Production Server
```bash
ssh your-username@your-server-ip
```

### Step 2: Locate Nginx Configuration
Your Nginx config is typically at one of these locations:
```bash
# Option 1: Check site-specific config
sudo nano /etc/nginx/sites-available/apis.bizlish.online

# Option 2: Check main config
sudo nano /etc/nginx/nginx.conf

# Option 3: Check conf.d
sudo nano /etc/nginx/conf.d/apis.bizlish.online.conf
```

### Step 3: Update Nginx Configuration

Add these directives to your server block:

```nginx
server {
    listen 443 ssl http2;
    server_name apis.bizlish.online;

    # SSL Configuration (keep your existing SSL settings)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # ===== ADD THESE LINES =====
    # Increase upload size limit
    client_max_body_size 100M;
    client_body_buffer_size 128k;
    
    # Increase timeouts for large uploads
    client_body_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    send_timeout 300s;
    
    # Allow chunked transfer encoding
    chunked_transfer_encoding on;
    # ===========================

    location / {
        # CORS headers for preflight
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://bizlish.online' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' 86400 always;
            add_header 'Content-Length' 0;
            add_header 'Content-Type' 'text/plain';
            return 204;
        }

        # Proxy to Node.js backend
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        
        # Important headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Disable buffering for large uploads
        proxy_request_buffering off;
        proxy_buffering off;
        
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 4: Test Nginx Configuration
```bash
# Test for syntax errors
sudo nginx -t

# If successful, you'll see:
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 5: Reload Nginx
```bash
# Reload Nginx to apply changes
sudo systemctl reload nginx

# Or restart if reload doesn't work
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx
```

### Step 6: Restart Your Node.js Backend
```bash
# If using PM2
pm2 restart all

# Or if using systemd
sudo systemctl restart your-app-name

# Or if running directly
# Stop the current process and restart
```

## 🧪 Testing the Fix

### Test 1: CORS Check
Open browser console on https://bizlish.online and run:
```javascript
fetch('https://apis.bizlish.online/api/health', {
  method: 'OPTIONS',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(r => console.log('CORS OK:', r.status))
```

### Test 2: Upload Small File
Try uploading a small image first (< 1MB) to verify basic functionality.

### Test 3: Upload Large File
Try uploading a video file (10-50MB) to verify the 413 error is resolved.

## 📊 Monitoring Upload Limits

Current limits after fix:
- **Nginx**: 100MB maximum request size
- **Node.js/Express**: 100MB body parser limit
- **Multer**: 100MB file upload limit
- **Timeout**: 300 seconds (5 minutes) for large uploads

## ⚠️ If Issues Persist

### Check Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check Node.js Application Logs
```bash
# If using PM2
pm2 logs

# Check system logs
sudo journalctl -u your-app-name -f
```

### Common Issues:

1. **Still getting 413 error**
   - Check if you have multiple Nginx config files
   - Verify changes are in the correct server block
   - Ensure you reloaded Nginx

2. **CORS still failing**
   - Check if CDN/Cloudflare is caching
   - Verify backend is actually restarted
   - Clear browser cache

3. **Timeout errors**
   - Increase timeout values further
   - Check server resources (CPU, memory)
   - Consider using a CDN for video hosting

## 🎯 Alternative: Use Cloud Storage

For production, consider uploading large files directly to:
- **AWS S3** - Reliable and scalable
- **Cloudinary** - Optimized for media
- **DigitalOcean Spaces** - Cost-effective
- **Google Cloud Storage** - Good integration

This approach:
- ✓ Bypasses server upload limits
- ✓ Reduces server load
- ✓ Provides better performance
- ✓ Includes CDN delivery

## 📞 Need Help?

If you're still experiencing issues after following this guide:
1. Share your Nginx error logs
2. Share Node.js application logs
3. Confirm which step failed
4. Check if you have any proxy/CDN in front of Nginx

---

**Quick Reference Commands:**
```bash
# Find Nginx config
sudo nginx -t

# Edit Nginx
sudo nano /etc/nginx/sites-available/default

# Reload Nginx
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/error.log
pm2 logs
```

