export default class Locations {
  constructor( config={} ) {
    this.config = config;

  }
  async display(locations) {
    let html = '';
    if(locations) {
      html = `
        <div class="locations">
          <ul>`;
          locations.forEach(location => {
            html += `
            <li class="location-item"
              data-lat="${location.lat}"
              data-lon="${location.lon}"
              data-name="${location.name}"
              data-country="${location.country}">
              ${location.name ? `<span>${location.name}</span>` : ''}
              ${location.state ? `<span>${location.state}</span>` : ''}
              ${location.country ? `<span>${location.country}</span>` : ''}
            </li>
            `
          });
          html += `</ul>
        </div>
      `;
    }
    return html;
  }
}