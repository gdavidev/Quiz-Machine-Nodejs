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
                0,
                'Qual desses produtos pode evitar que seu cliente reclame de mofo na parede?',
                'Uma camada de gesso resolve',
                'Pintura Parede Impermeabilizante',
                'Um desumidificador',
                'Pintura Parede Impermeabilizante',
            ),
            new Question(
                0,
                'Qual argamassa Kerakoll é ideal para assentar porcelanatos de super formatos – até 180x180 cm?',
                'Rejuntalite Colorido',
                'Argamassa Polivalente Super',
                'Cola Monstro Ultra',
                'Argamassa Polivalente Super',
            ),
            new Question(
                0,
                'Para impermeabilizar uma laje de cobertura que terá trânsito eventual de pessoas e que precisa resistir aos raios UV e às intempéries, qual produto Kerakoll você utilizaria?',
                'Cimento Chuva Não Entra Mais',
                'Manta Líquida Impermeabilizante',
                'Resina Telhado Feliz e Seco',
                'Manta Líquida Impermeabilizante',
            ),
            
            new Question(
                0,
                'Você precisa rejuntar pastilhas de vidro em uma piscina. Qual produto Kerakoll oferece juntas impermeáveis, resistência a produtos químicos e acabamento impecável?',
                'Rejunte Piscina Brilhando Sempre',
                'Fugalite Bio',
                'Argamassa Liga Tudo Aquática',
                'Fugalite Bio',
            ),
            new Question(
                0,
                'Seu banheiro está novinho, mas o rejunte rachou e está acumulando sujeira. Qual a melhor escolha para evitar isso?',
                'Qualquer massa branca que tiver à mão',
                'Escolher um rejunte impermeável da Kerakoll',
                'Melhor nem rejuntar, deixa aberto mesmo',
                'Escolher um rejunte impermeável da Kerakoll',
            ),
            new Question(
                0,
                'O piso da varanda está soltando porque a argamassa usada não resistiu às mudanças de temperatura. Como evitar isso?',
                'Trocar a varanda de lugar',
                'Colar com durex',
                'Usar argamassa flexível para áreas externas da Kerakoll',
                'Usar argamassa flexível para áreas externas da Kerakoll',
            ),
            new Question(
                0,
                'A Polivalente Pro é uma argamassa de alto desempenho que permite assentamento de peças sem limite de tamanho.',
                'Verdadeiro',
                'Falso',
                'Agora você me pegou',
                'Verdadeiro',
            ),
            new Question(
                0,
                'A época de chuvas começou e apareceu uma infiltração na sua fachada. Qual produto você deve utilizar?',
                'Rejunte Blinda Parede Total',
                'Parede Pintura Impermeabilizante Kerakoll',
                'Quebrar tudo e fazer de novo',
                'Parede Pintura Impermeabilizante Kerakoll',
            ),
            new Question(
                0,
                'Você precisa rejuntar um piso de porcelanato em uma área interna, como uma sala de estar, com juntas de até 5 mm e quer um acabamento liso e fácil de limpar. Qual produto Kerakoll é o mais indicado?',
                'Rejunta Tudo Rápido',
                'Rejuntalite Acrílico',
                'Massa Cinzenta para Rejuntar',
                'Rejuntalite Acrílico',
            ),
            new Question(
                0,
                'Você precisa fazer uma reforma rápida e quer assentar um porcelanato sobre outro piso já existente. O que fazer?',
                'Utilizar qualquer argamassa',
                'Só encostar um no outro e pronto',
                'Utilizar uma argamassa Kerakoll para sobreposição',
                'Utilizar uma argamassa Kerakoll para sobreposição',
            ),
        ];

        questions.forEach(question => {
            this.save(question);
        })
    }
}
module.exports = QuestionRepository;

