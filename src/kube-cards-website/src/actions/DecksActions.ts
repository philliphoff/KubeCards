import { IDeck } from "../Models";
import decksService from "../services/DecksService";
import { DecksState } from "../reducers/DecksReducer";

const decksSetState = (state: DecksState) => {
    return {
        type: 'KUBE_CARDS_DECKS_SET_STATE',
        state
    };
};

const decksSet = (decks: IDeck[]) => {
    return {
        type: 'KUBE_CARDS_DECKS_SET',
        decks
    };
};

export const decksCreateStarter = () => {
    return async (dispatch: any) => {
        dispatch(decksSetState(DecksState.Loading));

        try {
            const deck = await decksService.createStarterDeck();
            
            dispatch(decksSet([ deck ]));

            dispatch(decksSetState(DecksState.Loaded));
        }
        catch (Error) {
            dispatch(decksSetState(DecksState.Failed));
        }
    };
};

export const decksLoad = () => {
    return async (dispatch: any) => {
        dispatch(decksSetState(DecksState.Loading));

        try {
            const decks: IDeck[] = await decksService.getDecks();
            
            dispatch(decksSet(decks));

            dispatch(decksSetState(DecksState.Loaded));
        }
        catch (Error) {
            dispatch(decksSetState(DecksState.Failed));
        }
    };
};
