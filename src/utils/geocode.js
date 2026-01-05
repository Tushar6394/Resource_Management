export async function getAreaName(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'YourAppName' } });
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    } else {
      throw new Error('Geocoding API error');
    }
  } catch (error) {
    console.error('Error fetching area name:', error);
    return 'Unknown location';
  }
}
