const Question = require("../../shared/models/Question.js");

class QuestionRepository {
    constructor(db) {
        this.db = db;
    }

    get() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM questions", (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(row => {
                    return new Question(
                        row.id,
                        row.text,
                        row.alternative1,
                        row.alternative2,
                        row.alternative3,
                        row.answer,
                    );
                }));
            });
        });
    }

    save(question) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO questions (text, alternative1, alternative2, alternative3, answer)
                VALUES (?, ?, ?, ?, ?)
            `);
            stmt.run(
                question.text,
                question.alternative1,
                question.alternative2,
                question.alternative3,
                question.answer,
                err => {
                    err ? reject(err) : resolve(stmt)
                });
            stmt.finalize();
        });
    }

    update(question) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                UPDATE questions SET 
                    text = ? 
                    alternative1 = ? 
                    alternative2 = ? 
                    alternative3 = ?
                    answer = ? 
                WHERE id = ?
            `);
            stmt.run(
                question.text,
                question.alternative1,
                question.alternative2,
                question.alternative3,
                question.answer,
                question.id,
                err => {
                    err ? reject(err) : resolve(stmt)
                });
            stmt.finalize();
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`DELETE FROM questions WHERE id = ?`);
            stmt.run(id, err => err ? reject(err) : resolve(stmt));
            stmt.finalize();
        });
    }

    erase() {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`DELETE FROM questions`);
            stmt.run(err => err ? reject(err) : resolve(stmt));
            stmt.finalize();
        });
    }

    ensureCreated() {
        const query = `
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY,
                text TEXT NOT NULL,
                alternative1 TEXT NOT NULL,
                alternative2 TEXT NOT NULL,
                alternative3 TEXT NOT NULL,
                answer TEXT NOT NULL
            );
        `;
        this.db.run(query);
    }

    seed() {
        const questions = [
            new Question(
                1,
                "Qual material é conhecido como 'ouro branco' na construção civil?",
                "Mármore",
                "Cimento",
                "Tijolo",
                "Cimento"
            ),
            new Question(
                2,
                "Qual destes é um equipamento essencial em uma obra?",
                "Betoneira",
                "Microscópio",
                "Forno Industrial",
                "Betoneira"
            ),
            new Question(
                4,
                "Qual destes é um tipo de fundação profunda?",
                "Radier",
                "Sapata",
                "Estaca",
                "Estaca"
            ),
            new Question(
                5,
                "Qual o nome do documento que regulariza uma construção?",
                "Habite-se",
                "Alvará",
                "Laudo Técnico",
                "Habite-se"
            ),
            new Question(
                9,
                "Qual profissional é responsável pelo cálculo estrutural?",
                "Arquiteto",
                "Engenheiro Civil",
                "Designer de Interiores",
                "Engenheiro Civil"
            ),
            new Question(
                10,
                "Qual destes é um tipo de concreto especial?",
                "Concreto celular",
                "Concreto simples",
                "Concreto magro",
                "Concreto celular"
            ),
            new Question(
                11,
                "O que significa a sigla EPI na construção civil?",
                "Equipamento de Proteção Individual",
                "Estudo Preliminar de Impacto",
                "Exame Periódico Institucional",
                "Equipamento de Proteção Individual"
            ),
            new Question(
                12,
                "Qual destes é um tipo de telhado verde?",
                "Extensivo",
                "Suspenso",
                "Flutuante",
                "Extensivo"
            ),
            new Question(
                13,
                "Qual a função principal de um britador em uma obra?",
                "Misturar concreto",
                "Triturar materiais",
                "Compactar solo",
                "Triturar materiais"
            ),
            new Question(
                15,
                "Qual o nome do instrumento que mede o nível em uma obra?",
                "Trena",
                "Nível laser",
                "Paquímetro",
                "Nível laser"
            )
        ];

        questions.forEach(question => {
            this.save(question);
        })
    }
}
module.exports = QuestionRepository;