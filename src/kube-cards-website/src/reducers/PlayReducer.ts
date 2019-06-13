export enum KubeCardsPlayOpponentType {
    Player,
    Computer
}

export enum KubeCardsPlayState {
    Resuming,
    ChooseOpponent,
    ChooseDeck,
    ConfirmPlay,
    Creating,
    Playing
}

export interface IPlayStore {
    deckId?: string;
    gameId?: string;
    opponentId?: string;
    opponentType?: KubeCardsPlayOpponentType;
    state: KubeCardsPlayState;
}

const defaultState: IPlayStore = {
    state: KubeCardsPlayState.Resuming
};

const playReducer = (state: IPlayStore = defaultState, action: any) => {
    switch (action.type) {
        case 'KUBE_CARDS_PLAY_CHOOSE_DECK':
            return { ...state, deckId: action.deckId };
        case 'KUBE_CARDS_PLAY_CHOOSE_OPPONENT':
            return { ...state, opponentType: action.opponentType};
        case 'KUBE_CARDS_PLAY_MOVE_NEXT':
            return { ...state, state: action.state };
        case 'KUBE_CARDS_PLAY_SET_GAME_ID':
            return { ...state, gameId: action.gameId };
    }

    return state;
}

export default playReducer;
