export interface ICardStore {
    cardId: string;
    cardValue: number;
}

export interface IDeckStore {
    cards: ICardStore[];
    id: string;
}

export enum DecksState {
    NotLoaded = 0,
    Loading,
    Loaded,
    Failed
}

export interface IDecksStore {
    decks: IDeckStore[];
    state: DecksState;
}

const defaultStore: IDecksStore = {
    decks: [],
    state: DecksState.NotLoaded
};

const decksReducer = (state: IDecksStore = defaultStore, action: any): IDecksStore => {
    switch (action.type) {
        case 'KUBE_CARDS_DECKS_SET_STATE':
            return { ...state, state: action.state };
        case 'KUBE_CARDS_DECKS_SET':
            return { ...state, decks: action.decks };
    }
    return state;
}

export default decksReducer;
