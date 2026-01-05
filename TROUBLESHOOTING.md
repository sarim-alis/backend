# Troubleshooting ERR_PROXY_CONNECTION_FAILED

## Common Causes & Solutions

### 1. Service Not Running / Spinning Up
**Problem**: Render free tier services spin down after 15 minutes of inactivity.

**Solution**:
- Wait 30-60 seconds after making the first request
- Check Render Dashboard → Logs to see if the service is starting
- Look for: `Server running on port...` in the logs

### 2. Wrong URL Format
**Problem**: Using `http://` instead of `https://` or incorrect URL.

**Solution**:
- Always use `https://your-service-name.onrender.com`
- Test the root endpoint: `https://your-service-name.onrender.com/`
- Should return: "PartyMeet API running 🎉"

### 3. Browser Proxy Settings
**Problem**: Browser or system proxy interfering with requests.

**Solutions**:
- **Chrome/Edge**: Settings → System → Open proxy settings → Disable proxy
- **Firefox**: Settings → Network Settings → No proxy
- Try incognito/private browsing mode
- Try a different browser
- Check Windows proxy settings: Settings → Network & Internet → Proxy

### 4. Service Deployment Issues
**Problem**: Service failed to deploy or crashed.

**Check**:
1. Go to Render Dashboard → Your Service → Logs
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Database connection failed
   - Build errors

### 5. CORS Issues (Frontend)
**Problem**: Frontend can't connect to backend.

**Solution**:
- Set `FRONTEND_URL` environment variable in Render to your frontend URL
- Example: `FRONTEND_URL=https://your-frontend.com`
- Or use `*` for development (already configured)

### 6. Network/Firewall Issues
**Problem**: Corporate network or firewall blocking Render.

**Solution**:
- Try from a different network (mobile hotspot)
- Check if your network allows connections to `*.onrender.com`

## Quick Diagnostic Steps

1. **Test in Browser**:
   ```
   https://your-service-name.onrender.com/
   ```
   Should show: "PartyMeet API running 🎉"

2. **Test with curl** (if available):
   ```bash
   curl https://your-service-name.onrender.com/
   ```

3. **Check Render Logs**:
   - Render Dashboard → Service → Logs
   - Look for startup messages or errors

4. **Verify Environment Variables**:
   - All required variables are set
   - `DATABASE_URL` is correct
   - No typos in variable names

## Still Having Issues?

1. **Check Service Status**:
   - Render Dashboard → Service → Should show "Live"
   - If "Paused" or "Error", check logs

2. **Redeploy**:
   - Render Dashboard → Manual Deploy → Clear build cache & deploy

3. **Check Database**:
   - Verify MongoDB Atlas is accessible
   - Check network access settings in MongoDB Atlas
