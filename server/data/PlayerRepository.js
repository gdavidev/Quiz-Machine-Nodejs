const PlayerInfo = require("../../shared/models/PlayerInfo.js");

class PlayerRepository {
    constructor(db) {
        this.db = db;
    }

    save(playerInfo) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO players (name, email, phone, acceptedTerms, acceptedEmailOffers)
                VALUES (?, ?, ?, ?, ?)
            `);
            stmt.run(
                playerInfo.name,
                playerInfo.email,
                playerInfo.phone,
                playerInfo.acceptedTerms,
                playerInfo.acceptedEmailOffers,
                err => { err ? reject(err) : resolve(stmt) }
            );
            stmt.finalize();
        });
    }

    get() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM players", (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows.map(row => new PlayerInfo(
                    row.name,
                    row.email,
                    row.phone,
                    row.acceptedTerms,
                    row.acceptedEmailOffers,
                )));
            });
        });
    }

    ensureCreated() {
        const query = `
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                acceptedTerms INTEGER NOT NULL,
                acceptedEmailOffers INTEGER NOT NULL
            );
        `;
        this.db.run(query);
    }
}
module.exports = PlayerRepository;