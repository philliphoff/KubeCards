export enum KubeCardsPlayOpponentType {
    Player,
    Computer
}

export enum KubeCardsPlayState {
    Unknown = 0,
    ChooseOpponent,
    ChooseDeck,
    ConfirmPlay,
    Playing
}

export interface IPlayStore {
    deckId?: string;
    opponentId?: string;
    opponentType?: KubeCardsPlayOpponentType;
    state: KubeCardsPlayState;
}

const defaultState: IPlayStore = {
    state: KubeCardsPlayState.ChooseOpponent
};

const playReducer = (state: IPlayStore = defaultState, action: any) => {
    switch (action.type) {
        case 'KUBE_CARDS_PLAY_CHOOSE_DECK':
            return { ...state, deckId: action.deckId };
        case 'KUBE_CARDS_PLAY_CHOOSE_OPPONENT':
            return { ...state, opponentType: action.opponentType};
        case 'KUBE_CARDS_PLAY_MOVE_NEXT':
            return { ...state, state: action.state };
    }

    return state;
}

export default playReducer;
