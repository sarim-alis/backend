# Keepalive Setup for Render Free Tier

Your server now has keepalive endpoints to prevent it from spinning down on Render's free tier.

## Endpoints Created

1. **`/health`** - Health check endpoint
   - Returns server status, uptime, and timestamp
   - Example: `https://backend-5adj.onrender.com/health`

2. **`/ping`** - Simple ping endpoint
   - Returns pong with timestamp
   - Example: `https://backend-5adj.onrender.com/ping`

## Internal Keepalive

The server now pings itself every 5 minutes internally. However, **this won't prevent spin-down** because if the service is spun down, the code isn't running.

## Recommended: External Keepalive Service

For true keepalive, use an external service to ping your server:

### Option 1: UptimeRobot (Free, Recommended)
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Sign up for free account
3. Add New Monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: PartyMeet API Keepalive
   - **URL**: `https://backend-5adj.onrender.com/ping`
   - **Monitoring Interval**: 5 minutes
4. Save - it will ping your server every 5 minutes

### Option 2: cron-job.org (Free)
1. Go to [cron-job.org](https://cron-job.org)
2. Sign up for free account
3. Create new cron job:
   - **Title**: PartyMeet Keepalive
   - **Address**: `https://backend-5adj.onrender.com/ping`
   - **Schedule**: Every 5 minutes (`*/5 * * * *`)
4. Save

### Option 3: EasyCron (Free Tier)
1. Go to [EasyCron.com](https://www.easycron.com)
2. Sign up for free account
3. Create cron job to ping `/ping` endpoint every 5 minutes

## Testing

Test your endpoints:
```bash
# Health check
curl https://backend-5adj.onrender.com/health

# Ping
curl https://backend-5adj.onrender.com/ping
```

## Notes

- Render free tier spins down after **15 minutes** of inactivity
- External ping every **5 minutes** keeps it alive
- First request after spin-down takes 30-60 seconds (cold start)
- Consider upgrading to paid plan for production use
