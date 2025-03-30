import PlayerInfo from "@models/PlayerInfo.js";

export default class PlayersAPI {
  static async get() {
    return await fetch("http://localhost:3000/api/players", {
      method: "GET",
    })
        .then(res => res.json())
        .then(json => json.result.map(p => new PlayerInfo(p.email, p.phone)))
        .catch(err => console.log(err));
  }
  
  static save(email, phone) {
    fetch("http://localhost:3000/api/players/store", {
      method: "POST",
      body: JSON.stringify({email: email, phone: phone})
    })
        .catch(err => console.log(err));
  }
}