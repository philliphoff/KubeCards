import { IDeck } from "../reducers/DeckReducer";

const deckUpdateRefresh = (isRefreshing: boolean) => {
    return {
        type: 'KUBE_CARDS_DECK_UPDATE_REFRESH',
        isRefreshing
    };
};

const deckSet = (decks: IDeck[]) => {
    return {
        type: 'KUBE_CARDS_DECK_SET',
        decks
    };
};

export const deckRefresh = () => {
    return async (dispatch: any) => {
        dispatch(deckUpdateRefresh(true));

        try {
            const decks: IDeck[] = [
                {
                    id: 'Deck1',
                    cards: []
                },
                {
                    id: 'Deck2',
                    cards: []
                }
            ];
            
            dispatch(deckSet(decks));
        }
        finally {
            dispatch(deckUpdateRefresh(false));
        }
    };
};
