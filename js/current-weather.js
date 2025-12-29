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
  async display(data,dayData) {
    if(data.dt>data.sunrise&&data.dt<data.sunset) this.isDay = 1;
    return `
      <div class="current" style="background-color:${this.isDay==1?'#193d54ff':'#13111cff'}">
        <div class="row">
          <div class="col flex align-content-center justify-content-center px-2">
            ${this.#displayCurrentDateTime(data.dt)}
          </div>
        </div>
        <div class="weather-main ${data.weather[0].description.replace(/ /g, "-")}${this.isDay==0?'-night':''}"></div>


        <div class="row main-weather">
          <div class="col" style="box-shadow:2px 2px 20px rgba(0,0,0,0.3)">
            <div class="text-center" style="width:90%;margin:auto;">
              <p class="fs-8">${data.weather[0].main}</p>
              <br>
              <div class="flex flex-row justify-content-space-between align-items-center">
                <span style="text-center">Min<p class="blue fs-3 m-0">${dayData.temp.min}${this.unit.temperature}</p></span>
                <span>${this.#displayCurrentTemperature(data)}</span>
                <span style="text-center">Max<p class="red fs-3 m-0">${dayData.temp.max}${this.unit.temperature}</p></span>
              </div>
              <br>
              <p class="fs-6">${data.weather[0].description}</p>
            </div>
          </div>
        </div>

        <div class="current-details">
          <div class="row">
            <div class="col">
              ${data.wind_deg?`
              Wind
              <p class="pt-2 m-0"><span class="wind-rose">${this.#windRose(data.wind_deg)}</span></p>`:''}
            </div>
            <div class="col">
              ${data.humidity?`
              Humidity
              <p>${data.humidity}${this.unit.humidity}</p>`:''}
            </div>
            <div class="col">
              ${data.clouds?`
              Clouds
              <p>${data.clouds}${this.unit.percentage}</p>`:''}
            </div>
          </div>

          <div class="row">
            <div class="col">
              ${data.wind_speed?`
              Speed
              <p>${this.windData(data.wind_speed)}</p>`:''}
            </div>
            <div class="col">
              ${data.pressure?`
              Pressure
              <p>${data.pressure}${this.unit.pressure}</p>`:''}
            </div>
            <div class="col">
              ${data.visibility?`
              Visibility
              <p>${data.visibility/1000}${this.unit.distance}</p>`:''}
            </div>
          </div>

          <div class="row">
            <div class="col">
              ${data.wind_gust?`
              Gusts
              <p>${this.windData(data.wind_gust)}</p>`:''}
            </div>
            <div class="col">
              ${data.uvi?`
              UVI:
              <p>${data.uvi}</p>`:''}
            </div>
            <div class="col">
              ${data.dew_point?`
              Dew point
              <p>${data.dew_point}${this.unit.temperature}</p>`:''}
            </div>
          </div>

          <div class="row">
            <div class="col">
              ${data.sunrise?`
              Sunrise
              <p>${this.formatDate(data.sunrise).hour24}:${this.formatDate(data.sunrise).minute}</p>`:''}
            </div>
            <div class="col">
              ${data.sunset?`
              Sunset
              <p>${this.formatDate(data.sunset).hour24}:${this.formatDate(data.sunrise).minute}</p>`:''}
            </div>
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
      ${data.feels_like ? `<p>Real feel: <span style="font-size:18px;">${this.tempData(data.feels_like)}</span></p>`:''}
    `;
  }
  #windRose(data) {
    if(!data) return;
    return `
      <svg data-v-47880d39="" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" class="icon-wind-direction" style="transform: rotate(${data}deg);width:20px;">
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