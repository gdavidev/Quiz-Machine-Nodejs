export default class ConfigurationsAPI {
  static async get() {
    return await fetch("http://localhost:3000/api/configuration", {
      method: "GET",
    })
        .then(res => res.json())
        .then(json => json.result)
  }
  
  static update(configurationItem) {
    fetch("http://localhost:3000/api/configuration/update", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configurationItem)
    })
        .catch(err => console.error(err));
  }
}