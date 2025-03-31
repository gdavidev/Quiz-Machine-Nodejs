import QuestionDisplaySubGameState from "@classes/GameStates/AdminGameStates/QuestionsFormSubGameState";
import ConfigurationFormSubGameState from "@classes/GameStates/AdminGameStates/ConfigurationFormSubGameState";
import PlayersAPI from "@classes/DataFetching/PlayersAPI";
import ContainerVisibilityTransition from "@classes/ContainerVisibilityTransition";

export default class AdminMenuGameState {
    constructor(requestGameState, updateEnvironment) {
        this.requestAdminGameState = this.requestAdminGameState.bind(this);

        this.adminContainer = document.getElementById('admin-container');
        this.adminQuestionsBtn = document.getElementById('admin-questions-btn');
        this.adminConfigurationBtn = document.getElementById('admin-configuration-btn');
        this.adminExitBtn = document.getElementById('admin-exit-btn');
        this.exportPlayersInfoToCsvBtn = document.getElementById('export-players-info-to-csv-btn');

        this.adminQuestionsBtn.onclick = () => this.requestAdminGameState('questions-form')
        this.adminConfigurationBtn.onclick = () => this.requestAdminGameState('configuration-form')
        this.adminExitBtn.onclick = () => {
            updateEnvironment().then(() => {
                requestGameState('main-menu');
            })
        }
        this.exportPlayersInfoToCsvBtn.onclick = () => this.#exportPlayersInfoToCSV()

        this.states = {
            'questions-form': new QuestionDisplaySubGameState(),
            'configuration-form': new ConfigurationFormSubGameState(this.requestAdminGameState),
            'main-menu' : { enter(from, data) { requestGameState('main-menu') } }
        }
    }

    initialize() {
        ContainerVisibilityTransition.hide(this.adminContainer);
    }
    
    enter(from) {
        ContainerVisibilityTransition.show(this.adminContainer);

        this.currentState = 'questions-form'
        this.states['questions-form'].enter('', undefined);
    }

    exit(to) {
        ContainerVisibilityTransition.hide(this.adminContainer);
    }

    requestAdminGameState(gameState, data) {
        console.log('admin: ' + this.currentState + ' -> ' + gameState);

        this.states[this.currentState].exit(gameState);
        this.states[gameState].enter(this.currentState, data);
        this.currentState = gameState;
    }

    async #exportPlayersInfoToCSV() {
        const players = await PlayersAPI.get();
        console.log(players)
        let csvContent = "email;phone\n" + players.map(p => `${p.email};${p.phone}`).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "players.csv";
        a.click();
    }
}