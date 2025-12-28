export default class Functions {
  constructor( config={} ) {
    this.config = config;
    this.units = this.#getUnits();
    this.icons = this.#icons();

  }

  formatDate(timestamp) {
    const adjustedTimestamp = timestamp + this.config.timezone_offset;
    const date = new Date(adjustedTimestamp * 1000);

    const minutes = date.getMinutes().toString().padStart(2, '0');
    const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return {
      year: date.getFullYear(),
      month: monthName[date.getMonth()],
      date: date.getDate(),
      hour24: hours,
      hour12: hours12,
      minute: minutes,
      ampm: ampm,
      time24: `${hours.toString().padStart(2, '0')}:${minutes}`,
      time12: `${hours12}:${minutes} ${ampm}`,
      day: dayName[date.getDay()],
      fullDate: `${dayName[date.getDay()]}, ${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()}`
    };
  }
  startOfDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return Math.floor(startOfDay.getTime() / 1000);
  }
  endOfDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return Math.floor(nextDay.getTime() / 1000);
  }
  tempData(data) {
    if (!data && data !== 0) return '';

    const unit = this.units?.temperature || '°C';

    if (data > 25) {
      return `<span class="red">${Math.round(data)}${unit}</span>`;
    } else if (data > 20) {
      return `<span class="green">${Math.round(data)}${unit}</span>`;
    } else if (data > 15) {
      return `<span class="yellow">${Math.round(data)}${unit}</span>`;
    } else {
      return `<span class="blue">${Math.round(data)}${unit}</span>`;
    }
  }

  windData(data) {
    if (!data && data !== 0) return '';

    const unit = this.units?.speed || 'm/s';

    if (data > 25) {
      return `<span class="red">${Math.round(data)}${unit}</span>`;
    } else if (data > 15) {
      return `<span class="yellow">${Math.round(data)}${unit}</span>`;
    } else {
      return `<span class="green">${Math.round(data)}${unit}</span>`;
    }
  }

  #getUnits() {
    if (!this.config?.units) {
      return this.#getDefaultUnits();
    }
    const isMetric = this.config.units === 'metric';
    return {
      temperature: isMetric ? '°C' : '°F',
      speed: isMetric ? 'm/s' : 'mph',
      pressure: 'hPa',
      length: isMetric ? 'mm' : 'in',
      distance: isMetric ? 'km' : 'mi',
      humidity: '%',
      percentage: '%'
    };
  }
  #icons() {
    return {
      sunrise: '<span class="icon" style="font-size: 20px;">🌅</span>',
      sunset: '<span class="icon" style="font-size: 20px;">🌇</span>',
      sunface: '<span class="icon" style="font-size: 20px;">🌞</span>',
      sun: '<span class="icon" style="font-size: 20px;">☀️</span>',
      moonrise: '<span class="icon" style="font-size: 20px;">🌘</span>',
      moonset: '<span class="icon" style="font-size: 20px;">🌒</span>',
      arrowDown: '<span class="icon" style="font-size: 20px;">⏬</span>',
      arrowUp: '<span class="icon" style="font-size: 20px;">⏫</span>'
    }
  }
  moonPhases(phase) {
    const moonPhaseMapping = [
      { min: 0, max: 0.03, emoji: '🌑', name: 'New Moon' },
      { min: 0.03, max: 0.22, emoji: '🌒', name: 'Waxing Crescent' },
      { min: 0.22, max: 0.28, emoji: '🌓', name: 'First Quarter' },
      { min: 0.28, max: 0.47, emoji: '🌔', name: 'Waxing Gibbous' },
      { min: 0.47, max: 0.53, emoji: '🌕', name: 'Full Moon' },
      { min: 0.53, max: 0.72, emoji: '🌖', name: 'Waning Gibbous' },
      { min: 0.72, max: 0.78, emoji: '🌗', name: 'Last Quarter' },
      { min: 0.78, max: 0.97, emoji: '🌘', name: 'Waning Crescent' },
      { min: 0.97, max: 1, emoji: '🌑', name: 'New Moon' }
    ];
    for (const phaseInfo of moonPhaseMapping) {
      if (phase >= phaseInfo.min && phase < phaseInfo.max) {
        return phaseInfo;
      }
    }
  }
  getMoonPhaseName(moonPhase) {
    if (moonPhase === 0 || moonPhase === 1) return "New Moon";
    if (moonPhase < 0.25) return "Waxing Crescent";
    if (moonPhase === 0.25) return "First Quarter";
    if (moonPhase < 0.5) return "Waxing Gibbous";
    if (moonPhase === 0.5) return "Full Moon";
    if (moonPhase < 0.75) return "Waning Gibbous";
    if (moonPhase === 0.75) return "Last Quarter";
    return "Waning Crescent";
  }

  #getDefaultUnits() {
    return {
      temperature: '°C',
      speed: 'm/s',
      pressure: 'hPa',
      length: 'mm',
      distance: 'km',
      humidity: '%'
    };
  }
}