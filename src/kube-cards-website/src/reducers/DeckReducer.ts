export interface ICard {
    id: string;
    value: number;
}

export interface IDeck {
    cards: ICard[];
    id: string;
}

export interface IDeckStore {
    decks: IDeck[];
    isRefreshing: boolean;
}

const defaultStore: IDeckStore = {
    decks: [],
    isRefreshing: false
};

const decksReducer = (state: IDeckStore = defaultStore, action: any): IDeckStore => {
    switch (action.type) {
        case 'KUBE_CARDS_DECK_UPDATE_REFRESH':
            return { ...state, isRefreshing: action.isRefreshing };
        case 'KUBE_CARDS_DECK_SET':
            return { ...state, decks: action.decks };
    }
    return state;
}

export default decksReducer;
