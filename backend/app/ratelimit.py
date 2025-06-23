from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from aiocache import caches
import logging

caches.set_config({
    'default': {
        'cache': "aiocache.SimpleMemoryCache",
        'ttl': 60  
    }
})

logger = logging.getLogger(__name__)

class APIRateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests=10, window_seconds=60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.cache = caches.get('default')
    
    async def dispatch(self, request: Request, call_next):
        try:            
            ip = self._get_client_ip(request)
            if not ip:
                logger.warning("Could not determine client IP")
                return await call_next(request)
                        
            rate_limit_key = f"api_rate_limit:{ip}"
                        
            current_count = await self.cache.get(rate_limit_key)
            
            if current_count is None:                
                await self.cache.set(rate_limit_key, 1, ttl=self.window_seconds)
                logger.info(f"New rate limit window started for IP: {ip}")
                
            elif current_count >= self.max_requests:                
                logger.warning(f"Rate limit exceeded for IP: {ip}. Count: {current_count}")
                return Response(
                    content="Too many requests. Please try again later.",
                    status_code=409,
                    headers={
                        "X-RateLimit-Limit": str(self.max_requests),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": str(self.window_seconds)
                    }
                )
            else:                
                try:
                    new_count = await self.cache.increment(rate_limit_key)
                    if new_count is None:                        
                        await self.cache.set(rate_limit_key, 1, ttl=self.window_seconds)
                        new_count = 1
                    
                    logger.debug(f"Rate limit count for IP {ip}: {new_count}/{self.max_requests}")
                    
                except Exception as e:
                    logger.error(f"Error incrementing rate limit for IP {ip}: {e}")                    
                    await self.cache.set(rate_limit_key, current_count + 1, ttl=self.window_seconds)
                        
            response = await call_next(request)
                        
            current_count = await self.cache.get(rate_limit_key) or 0
            remaining = max(0, self.max_requests - current_count)
            
            response.headers["X-RateLimit-Limit"] = str(self.max_requests)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            response.headers["X-RateLimit-Reset"] = str(self.window_seconds)
            
            return response
            
        except Exception as e:
            logger.error(f"Rate limiter middleware error: {e}")            
            return await call_next(request)
    
    def _get_client_ip(self, request: Request) -> str:
        """Lấy IP của client, xử lý trường hợp có proxy/load balancer"""        
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:            
            return forwarded_for.split(",")[0].strip()
                
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
                
        if request.client and request.client.host:
            return request.client.host
        
        return None