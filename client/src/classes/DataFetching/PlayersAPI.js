import PlayerInfo from "@models/PlayerInfo.js";

export default class PlayersAPI {
  static async get() {
    return await fetch("http://localhost:3000/api/players", {
      method: "GET",
    })
        .then(res => res.json())
        .then(json => json.result.map(p => new PlayerInfo(
            p.name,
            p.email,
            p.phone,
            p.acceptedTerms,
            p.acceptedEmailOffers
        )))
        .catch(err => console.error(err));
  }
  
  static save(playerInfo) {
    fetch("http://localhost:3000/api/players/store", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playerInfo)
    })
        .catch(err => console.error(err));
  }
}