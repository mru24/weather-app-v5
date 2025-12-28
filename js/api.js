export default class Api {
  constructor( config={} ) {
    this.config = config;

  }
  async getWeather(location={}) {
    let latitude,longitude;
    if(location.latitude && location.longitude) {
      latitude = location.latitude;
      longitude = location.longitude;
    } else {
      try {
        const geoLocation = await this.#getLocation();
        latitude = geoLocation.latitude;
        longitude = geoLocation.longitude;
      } catch (error) {
        console.error("Geolocation error: ",error);
        return null;
      }
    }
    const url = `${this.config.apiBase}/data/${this.config.apiVersion}/onecall?lat=${latitude}&lon=${longitude}&units=${this.config.units}&appid=${this.config.apiKey}`;
    return await this.#readApi(url);
  }
  async #getLocation() {
    if (!navigator.geolocation) throw new Error('Geolocation is not supported by this browser');
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          maximumAge: 600000,
          timeout: 7000,
          enableHighAccuracy: true
        });
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      throw new Error(`Geolocation error: ${error.message}`);
    }
  }
  async searchLocation(query) {
    if(!query) return;
    const url = `${this.config.apiBase}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=8&appid=${this.config.apiKey}`;
    return await this.#readApi(url);
  }
  async #readApi(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result =  await response.json();
      console.log('readApi',result);
      if(result.timezone_offset) this.config.timezone_offset = result.timezone_offset;
      return result;
    } catch (err) {
      console.error('API fetch error:', err);
      return null;
    }
  }
}