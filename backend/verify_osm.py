import asyncio
from services.osm_service import get_distance_km

async def test_osm():
    origin = "London, UK"
    destination = "Paris, France"
    try:
        dist = await get_distance_km(origin, destination)
        print(f"Distance between {origin} and {destination}: {dist:.2f} km")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_osm())
