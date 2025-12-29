import Api from './api.js';
import Locations from './locations.js';
import Current from './current-weather.js';
import Daily from './daily-forecast.js';
import { data } from './data.js';

class App {
  constructor() {
    this.config = this.#config();
    this.location = { latitude:'',longitude:'',name:'',country:'' }

  }
  async init() {
    const dataApi = new Api(this.config);
    if(!dataApi) return;
    this.dataApi = dataApi;
    this.#initWeather();

    document.querySelector('#search input').addEventListener('keyup',async (e)=>{
      if(e.target.value.length>3) {
        const searchLocations = await this.#callSearchApi(e.target.value,this.config);
        if(!searchLocations) return;
        const locations = new Locations(this.config);
        const locationsHTML = await locations.display(searchLocations);
        if(!locationsHTML) return;
        document.querySelector('#locations').innerHTML = locationsHTML;
      };
    })
    document.addEventListener('click',async (e)=>{
      if(!e.target.matches('li[data-lat][data-lon]')) return;
      this.location.latitude = e.target.dataset.lat;
      this.location.longitude = e.target.dataset.lon;
      this.location.name = e.target.dataset.name;
      this.location.country = e.target.dataset.country;
      this.#updateWeather();
      document.querySelector('#search input').value = this.location.name + ' '+this.location.country;
      document.querySelector('#locations').innerHTML = '';
    })
    document.querySelector('#input-reset').addEventListener('click',(e)=>{
      e.target.previousElementSibling.value = '';
      document.querySelector('#locations').innerHTML = '';
      this.location = { latitude:'',longitude:'',name:'',country:'' }
      this.config.timezone_offset = 0;
      this.#initWeather();
    });
    document.addEventListener('click',(e)=>{
      if(e.target.matches('.trigger')) {
        if(e.target.nextElementSibling.classList.contains('active')) {
          e.target.nextElementSibling.classList.remove('active');
          e.target.innerHTML = 'Show hourly forecast <span class="icon" style="font-size: 20px;">⏬</span>';
        } else {
          e.target.nextElementSibling.classList.add('active');
          e.target.innerHTML = 'Hide hourly forecast <span class="icon" style="font-size: 20px;">⏫</span>';

        };

      };

    });
  }
  async #callSearchApi(query,config) {
    const searchData = await this.dataApi.searchLocation(query);
    if(searchData) return searchData;
  }
  async #initWeather() {
    //CURRENT WEATHER
    const currentData = await this.dataApi.getWeather(this.location);
    if(currentData) console.log("INITIAL CURRENT: ",currentData.current);
    this.#displayCurrentWeather(currentData.current,currentData.daily[0]);

    //FORECAST DAILY WEATHER
    const forecastDailyData = await this.dataApi.getWeather(this.location);
    if(forecastDailyData) console.log("INITIAL DAILY: ",forecastDailyData.daily,forecastDailyData.hourly);
    this.#displayDailyForecast(forecastDailyData.daily,forecastDailyData.hourly);

  }
  async #updateWeather() {
    //CURRENT WEATHER
    const currentData = await this.dataApi.getWeather(this.location);
    if(currentData) console.log("UPDATED CURRENT: ",currentData.current);
    this.#displayCurrentWeather(currentData.current,currentData.daily[0]);

    //FORECAST DAILY WEATHER
    const forecastDailyData = await this.dataApi.getWeather(this.location);
    if(forecastDailyData) console.log("UPDATED DAILY: ",forecastDailyData.daily,forecastDailyData.hourly);
    this.#displayDailyForecast(forecastDailyData.daily,forecastDailyData.hourly);

  }
  async #displayCurrentWeather(currentData,dayData) {
    const current = new Current(this.config);
    const currentHtml = await current.display(currentData,dayData);
    document.querySelector('#current').innerHTML = currentHtml;
  }
  async #displayDailyForecast(forecastDaily,forecastHourly) {
    const daily = new Daily(this.config);
    const dailyHtml = await daily.display(forecastDaily,forecastHourly);
    document.querySelector('#forecast').innerHTML = dailyHtml;
  }
  #config() {
    return {
      apiBase: 'https://api.openweathermap.org',
      apiVersion: '3.0',
      apiKey: data.api_key,
      units: 'metric',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone_offset: 0
    }
  }
}

export default App;
