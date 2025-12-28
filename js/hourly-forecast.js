import Functions from './functions.js';

export default class Hourly {
  constructor( config={} ) {
    this.config = config;

    this.functions = new Functions(this.config);
    this.formatDate = this.functions.formatDate.bind(this.functions);
    this.tempData = this.functions.tempData.bind(this.functions);
    this.windData = this.functions.windData.bind(this.functions);
    this.unit = this.functions.units;
    this.icon = this.functions.icons;

  }
  async display(indexDay,hour) {
    return `
      <div class="hour-item">
        <div class="row">
          <div class="col">
            <h4>${this.formatDate(hour.dt).hour24}:${this.formatDate(hour.dt).minute}</h4>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p>Temp (Feels like)</p>
            ${this.#displayHourTemperature(hour.temp,hour.feels_like)}
            <br>
            <p>Chance of rain (snow)</p>
            <p>${hour.pop}${this.unit.percentage}</p>
            ${hour.rain?`<p>Rain: ${hour.rain}mm</p>`:''}
            ${hour.snow?`<p>Snow: ${hour.snow}mm</p>`:''}
          </div>
          <div class="col">
            <div class="text-center">
              <p>${hour.weather[0].main}</p>
              <p><img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" /></p>
              <p>${hour.weather[0].description}</p>
            </div>
          </div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            ${hour.wind_deg?`<p><span class="wind-rose p-2">${this.#windRose(hour.wind_deg)}</span></p>`:''}
          </div>
          <div class="col">
            ${hour.wind_speed?`<p>Wind: ${this.windData(hour.wind_speed)}</p>`:''}
            ${hour.wind_gust?`<p>Gusts: ${this.windData(hour.wind_gust)}</p>`:''}
          </div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            ${hour.dew_point?`<p>Dew point: ${hour.dew_point}${this.unit.temperature}</p>`:''}
            ${hour.pressure?`<p>Pressure: ${hour.pressure}${this.unit.pressure}</p>`:''}
            ${hour.uvi?`<p>UVI: ${hour.uvi}</p>`:''}
          </div>
          <div class="col">
            ${hour.clouds?`<p>Clouds: ${hour.clouds}${this.unit.percentage}</p>`:''}
            ${hour.visibility?`<p>Visibility: ${hour.visibility/1000}${this.unit.distance}</p>`:''}
          </div>
        </div>
      </div>
    `;

  }
  #displayHourTemperature(temp,feels_like) {
    return `
      ${temp ?
        `<p>${this.tempData(temp)} ${feels_like ?`(${this.tempData(feels_like)})`:''}</p>`:''}
    `;
  }
  #windRose(data) {
    if(!data) return;
    return `
      <svg data-v-47880d39="" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" class="icon-wind-direction" style="transform: rotate(${data}deg);width:45px;">
        <g data-v-47880d39="" fill="#5d5d64">
          <path data-v-47880d39="" d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"></path><path data-v-47880d39="" d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z">
        </path>
      </g>
    </svg>
    `;
  }
}