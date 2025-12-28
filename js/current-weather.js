import Functions from './functions.js';

export default class Current {
  constructor( config={} ) {
    this.config = config;

    this.functions = new Functions(this.config);
    this.formatDate = this.functions.formatDate.bind(this.functions);
    this.tempData = this.functions.tempData.bind(this.functions);
    this.windData = this.functions.windData.bind(this.functions);
    this.unit = this.functions.units;
    this.icon = this.functions.icons;

    this.isDay = 0;

  }
  async display(data) {
    if(data.dt>data.sunrise&&data.dt<data.sunset) this.isDay = 1;
    return `
      <div class="current" style="background-color:${this.isDay==1?'#193d54ff':'#13111cff'}">
        <div class="row">
          <div class="col flex align-content-center justify-content-center px-2">
            ${this.#displayCurrentDateTime(data.dt)}
          </div>
        </div>
        <div class="weather-main ${data.weather[0].description.replace(/ /g, "-")}${this.isDay==0?'-night':''}"></div>
        <div class="row">
          <div class="col flex align-content-center justify-content-center">
            <div class="current-temperature">
              ${this.#displayCurrentTemperature(data)}
            </div>
          </div>
          <div class="col flex align-content-center justify-content-center">
            <div class="current-info text-center">
              ${this.#displayWeatherOverview(data.weather[0])}
            </div>
          </div>
        </div>
        <div class="current-details">
          <div class="row">
            <div class="col">
              ${data.wind_speed?`<p><span class="wind-rose p-2">${this.#windRose(data.wind_deg)}</span>Wind: ${this.windData(data.wind_speed)}</p>`:''}
              ${data.wind_gust?`<p>Gusts: ${this.windData(data.wind_gust)}</p>`:''}
              ${data.humidity?`<p>Humidity: ${data.humidity}${this.unit.humidity}</p>`:''}
              ${data.pressure?`<p>Pressure: ${data.pressure}${this.unit.pressure}</p>`:''}
            </div>
            <div class="col">
              ${data.clouds?`<p>Clouds: ${data.clouds}${this.unit.percentage}</p>`:''}
              ${data.visibility?`<p>Visibility: ${data.visibility/1000}${this.unit.distance}</p>`:''}
              ${data.dew_point?`<p>Dew point: ${data.dew_point}${this.unit.temperature}</p>`:''}
              ${data.uvi?`<p>UVI: ${data.uvi}</p>`:''}
              ${data.pressure?`<p>Pressure: ${data.pressure}${this.unit.pressure}</p>`:''}
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col">
              ${data.sunrise ? `<p>${this.icon.sunrise}Sunrise: ${this.formatDate(data.sunrise).hour24}:${this.formatDate(data.sunrise).minute}</p>`:''}
              ${data.sunset ? `<p>${this.icon.sunset}Sunset: ${this.formatDate(data.sunset).hour24}:${this.formatDate(data.sunrise).minute}</p>`:''}
            </div>
            <div class="col"></div>
          </div>
        </div>
      <div>
    `;
  }
  #displayCurrentDateTime(timestamp) {
    return `
      ${this.formatDate(timestamp).fullDate}
      ${this.formatDate(timestamp).hour24}:${this.formatDate(timestamp).minute}
      ${this.formatDate(timestamp).ampm}
    `;
  }
  #displayCurrentTemperature(data) {
    return `
      <h1>${this.tempData(data.temp)}</h1>
      ${data.feels_like ? `<p>Feels like: ${this.tempData(data.feels_like)}</p>`:''}
    `;
  }
  #windRose(data) {
    if(!data) return;
    return `
      <svg data-v-47880d39="" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" class="icon-wind-direction" style="transform: rotate(${data}deg);width:22px;">
        <g data-v-47880d39="" fill="#5d5d64">
          <path data-v-47880d39="" d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"></path><path data-v-47880d39="" d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z">
        </path>
      </g>
    </svg>
    `;
  }
  #displayWeatherOverview(info) {
    return `
      <h2>${info.main}</h2>
      <p>
        <img src="https://openweathermap.org/img/wn/${info.icon}@2x.png" />
      </p>
      <p>${info.description}</p>
    `;
  }
}