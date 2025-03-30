const PlayerRepository = require("./PlayerRepository.js");
const QuestionRepository = require("./QuestionRepository.js");
const ConfigurationRepository = require("./ConfigurationRepository.js");
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');

class DataAccess {
    constructor() {
    }
    
    initialize(databasePath) {
        const firstDatabaseCreation = !fs.existsSync(databasePath);
        
        this.db = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Database connection error:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
                
                this.playerRepository = new PlayerRepository(this.db);
                this.questionRepository = new QuestionRepository(this.db);
                this.configurationRepository = new ConfigurationRepository(this.db);
                
                if (firstDatabaseCreation) {
                    this.db.serialize(() => {
                        this.#ensureCreated();
                        this.#seedDatabase();
                    })
                }
            }
        });
    }

    #ensureCreated() {
        this.playerRepository.ensureCreated();
        this.questionRepository.ensureCreated();
        this.configurationRepository.ensureCreated();
    }

    #seedDatabase() {
        this.questionRepository.seed()
        this.configurationRepository.seed()
    }
}

const dataAccess = new DataAccess();

module.exports = dataAccess;