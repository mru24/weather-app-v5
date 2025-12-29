import Functions from './functions.js';
import Hourly from './hourly-forecast.js';

export default class Daily {
  constructor( config={} ) {
    this.config = config;

    this.functions = new Functions(this.config);
    this.formatDate = this.functions.formatDate.bind(this.functions);
    this.tempData = this.functions.tempData.bind(this.functions);
    this.windData = this.functions.windData.bind(this.functions);
    this.startOfDay = this.functions.startOfDay.bind(this.functions);
    this.endOfDay = this.functions.endOfDay.bind(this.functions);
    this.unit = this.functions.units;
    this.icon = this.functions.icons;
    this.moonPhase = this.functions.moonPhases.bind(this.functions);

    this.hourly = new Hourly(this.config);

  }
  async display(dataDaily,dataHourly) {
    let html = '';
    let hourHtml = '';
    html += `
      <div class="daily-forecast">`;
      for(const [indexDay,day] of dataDaily.entries()) {
        const dayHtml = await this.#displayDayForecast(indexDay,day);
        html += dayHtml;
        html += `
        <div class="hourly-forecast">
          <div class="trigger text-center">Show hourly forecast ${this.icon.arrowDown}</div>
          <div class="content hidden">`;
        for(const [indexHour,hour] of dataHourly.entries()) {
          if(hour.dt>=this.startOfDay(day.dt) && hour.dt<=this.endOfDay(day.dt)) {
            const hourHtml = await this.#displayHourForecast(indexHour,hour);
            html += hourHtml;
          }
        }
        html += `
          </div>
        </div>`;
      }
    html += `
      </div>
    `;
    return html;
  }
  async #displayDayForecast(index,day) {
    if(day.dt>day.sunrise&&day.dt<day.sunset) this.isDay = 1;
    return `
      <div class="day" data-timestamp="${day.dt}">
        ${this.#displayDayDate(index,day.dt)}

        <div class="row">
          <div class="col reset" style="margin-right:-15px;position:relative;z-index:5;box-shadow:0 0 30px black;">
            <div class="weather-main ${day.weather[0].description.replace(/ /g, "-")}"></div>
          </div>
          <div class="col reset" style="margin-left:-15px;">
            <div class="weather-main ${day.weather[0].description.replace(/ /g, "-")}-night" style="border-radius:0 inherit inherit 0"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="text-center px-2">
              <p>${day.summary}</p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <p>Temp (Feels like)</p>
            <div class="text-left">
            ${this.#displayDayTemperature(index,day.temp,day.feels_like)}
            </div>
          </div>
          <div class="col">
            <div class="text-center">
              ${this.#displayDayOverview(index,day.weather[0])}
              <br>
              ${day.wind_speed?`<p><span class="wind-rose p-2">${this.#windRose(index,day.wind_deg)}</span></p>
              <p>Wind: <span class="fs-3">${this.windData(day.wind_speed)}</span></p>`:''}
              ${day.wind_gust?`<p>Wind gusts: <span class="fs-3">${this.windData(day.wind_gust)}</span></p>`:''}
            </div>
          </div>
        </div>
        <hr>
        <div class="daily-details">
          <div class="row">
            <div class="col">
              ${day.clouds?`
              Clouds
              <p>${day.clouds}${this.unit.percentage}</p>`:''}
            </div>
            <div class="col">
              ${day.humidity?`
              Humidity
              <p>${day.humidity}${this.unit.humidity}</p>`:''}
            </div>
            <div class="col">
              ${day.dew_point?`
              Dew point
              <p>${day.dew_point}${this.unit.temperature}</p>`:''}
            </div>
          </div>

          <div class="row">
            <div class="col">
              ${day.uvi?`
              UVI
              <p>${day.uvi}</p>`:''}
            </div>
            <div class="col">
              ${day.pop?`
              Chance of rain (snow)
              <p>${day.pop}${this.unit.percentage}</p>`:''}
            </div>
            <div class="col">
              ${day.rain?`
              Rain
              <p>${day.rain}mm</p>`:''}
              ${day.snow?`
              Snow
              <p>${day.snow}mm</p>`:''}
            </div>
          </div>

          <div class="row">
            <div class="col">
              ${day.moonrise?`
              Moonrise
              <p>${this.formatDate(day.moonrise).hour24}:${this.formatDate(day.moonrise).minute}</p>`:''}
            </div>
            <div class="col">
              ${day.sunrise?`
              Sunrise
              <p>${this.formatDate(day.sunrise).hour24}:${this.formatDate(day.sunrise).minute}</p>`:''}
            </div>
          </div>

          <div class="row">
            <div class="col">
              ${day.moonset?`
              Moonset
              <p>${this.formatDate(day.moonset).hour24}:${this.formatDate(day.moonset).minute}</p>`:''}
            </div>
            <div class="col">
              ${day.sunset?`
              Sunset
              <p>${this.formatDate(day.sunset).hour24}:${this.formatDate(day.sunrise).minute}</p>`:''}
            </div>
          </div>

          <div class="row">
            <div class="col">
              ${day.moon_phase?`<p><span class="fs-7 mr-1">${this.moonPhase(day.moon_phase).emoji}</span> ${this.moonPhase(day.moon_phase).name}</p>`:''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  #displayDayDate(index,timestamp) {
    let day = this.formatDate(timestamp).day;
    if(index===0) day = `<span style="font-size:19px;">Today</span> ${this.formatDate(timestamp).day}`;
    if(index===1) day = `<span style="font-size:19px;">Tomorrow</span> ${this.formatDate(timestamp).day}`;
    return `
      <div class="header">
        ${day} ${this.formatDate(timestamp).date}/${this.formatDate(timestamp).month}/${this.formatDate(timestamp).year}
      </div>
    `;
  }
  #displayDayTemperature(index,temp,feels_like) {
    return `
      ${temp.day ?
        `<p>Day ${this.tempData(temp.day)} ${feels_like.day ?`(${this.tempData(feels_like.day)})`:''}</p>`:''}
      ${temp.min ?
        `<p>Min ${this.tempData(temp.min)} ${feels_like.min ?`(${this.tempData(feels_like.min)})`:''}</p>`:''}
      ${temp.max ?
        `<p>Max ${this.tempData(temp.max)} ${feels_like.max ?`(${this.tempData(feels_like.max)})`:''}</p>`:''}
      ${temp.morn ?
        `<p>Morn ${this.tempData(temp.morn)} ${feels_like.morn ?`(${this.tempData(feels_like.morn)})`:''}</p>`:''}
      ${temp.eve ?
        `<p>Eve ${this.tempData(temp.eve)} ${feels_like.eve ?`(${this.tempData(feels_like.eve)})`:''}</p>`:''}
      ${temp.night ?
        `<p>Night ${this.tempData(temp.night)} ${feels_like.night ?`(${this.tempData(feels_like.night)})`:''}</p>`:''}
    `;
  }
  #displayDayOverview(index,info) {
    let html = '';
    if(index===0 || index==1) {
      html+=`
        <h2>${info.main}</h2>
        <p>
          <img src="https://openweathermap.org/img/wn/${info.icon}@2x.png" width="80" />
        </p>
        <p>${info.description}</p>
      `;
    } else {
      html+=`
        <h4>${info.main}</h4>
        <p>
          <img src="https://openweathermap.org/img/wn/${info.icon}.png" />
        </p>
        <p>${info.description}</p>
      `;
    }
    return html;
  }
  #windRose(index,data) {
    let size = '25px';
    if(index==0||index==1) size = '35px';
    if(!data) return;
    return `
      <svg data-v-47880d39="" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" class="icon-wind-direction" style="transform: rotate(${data}deg);width:${size};">
        <g data-v-47880d39="" fill="#59595b">
          <path data-v-47880d39="" d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"></path><path data-v-47880d39="" d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z">
        </path>
      </g>
    </svg>
    `;
  }
  async #displayHourForecast(i,hour) {
    const hourlyHtml = await this.hourly.display(i,hour);
    return hourlyHtml;
  }
}
