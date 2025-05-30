if (not SERVER) then return end

omni_bot = {}

-----------------------------------------
-- 🚀 Symfony REST API Configuration
-----------------------------------------

-- Symfony REST API endpoint (e.g. "http://google.com/api/messages")
omni_bot.SYMFONY_REST_API_URL="http://<yourdomain>/api/messages"
-- Polling interval in seconds (e.g. 5 = every 5s)
omni_bot.SYMFONY_REST_API_POLLING_TIMER=5