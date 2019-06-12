import { KubeCardsPlayOpponentType, KubeCardsPlayState } from "../reducers/PlayReducer";
import { gamesCreate } from "./GamesActions";

export const playChooseOpponent = (opponentType: KubeCardsPlayOpponentType, opponentId?: string) => ({
    type: 'KUBE_CARDS_PLAY_CHOOSE_OPPONENT',
    opponentType,
    opponentId
});

export const playChooseDeck = (deckId: string) => ({
    type: 'KUBE_CARDS_PLAY_CHOOSE_DECK',
    deckId
});

export const playMoveNext = (state: KubeCardsPlayState) => ({
    type: 'KUBE_CARDS_PLAY_MOVE_NEXT',
    state
});

export const playCreateGame = (deckId: string) => {
    return async (dispatch: any) => {
        try {
            await dispatch(gamesCreate(deckId));

            await dispatch(playMoveNext(KubeCardsPlayState.Playing));
        }
        catch (err) {
            await dispatch(playMoveNext(KubeCardsPlayState.ConfirmPlay));

            throw err;
        }
    };
};
