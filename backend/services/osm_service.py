import httpx
import math

async def get_coordinates(location: str) -> tuple[float, float]:
    """Fetch latitude and longitude for a given location using Nominatim API."""
    url = "https://nominatim.openstreetmap.org/search"
    headers = {
        "User-Agent": "CarbonTracker/1.0 (contact@carbontracker.example.com)"
    }
    params = {
        "q": location,
        "format": "json",
        "limit": 1
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            raise ValueError(f"Could not find coordinates for location: {location}")
            
        return float(data[0]["lat"]), float(data[0]["lon"])

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth surface."""
    # Earth radius in kilometers
    R = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat / 2) ** 2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * (math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance

async def get_distance_km(origin: str, destination: str) -> float:
    """Get the distance in kilometers between an origin and destination string."""
    lat1, lon1 = await get_coordinates(origin)
    lat2, lon2 = await get_coordinates(destination)
    
    return haversine(lat1, lon1, lat2, lon2)
