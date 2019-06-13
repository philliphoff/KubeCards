import { KubeCardsPlayOpponentType, KubeCardsPlayState } from "../reducers/PlayReducer";
import { gamesAddExisting, gamesGet } from "./GamesActions";
import { IKubeCardsStore } from "../KubeCardsStore";
import gamesService from "../services/GamesService";

const playSetGameId = (gameId: string) => ({
    type: 'KUBE_CARDS_PLAY_SET_GAME_ID',
    gameId
});

export const playSetCardId = (cardId: string | undefined) => ({
    type: 'KUBE_CARDS_PLAY_SET_CARD_ID',
    cardId
});

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

export const playCard = () => {
    return async (dispatch: any, getState: () => IKubeCardsStore) => {
        const state = getState();

        const { cardId, gameId } = state.play;

        if (!gameId) {
            throw new Error('Cannot play a card if a game is not in progress.');
        }

        if (!cardId) {
            throw new Error('Cannot play a card without selecting one first.');
        }

        const updatedGame = await gamesService.playCard(gameId, cardId);

        await dispatch(gamesAddExisting(updatedGame));

        await dispatch(playSetCardId(undefined));
    };
};

export const playCreateGame = () => {
    return async (dispatch: any, getState: () => IKubeCardsStore) => {
        try {
            const state = getState();

            const { deckId } = state.play;

            if (!deckId) {
                throw new Error('Cannot create a game without a selected deck.');
            }

            const newGame = await gamesService.createGame(deckId);

            await dispatch(gamesAddExisting(newGame));
            
            await dispatch(playSetGameId(newGame.gameId));

            await dispatch(playMoveNext(KubeCardsPlayState.Playing));
        }
        catch (err) {
            await dispatch(playMoveNext(KubeCardsPlayState.ConfirmPlay));

            throw err;
        }
    };
};

export const playResumeGame = () => {
    return async (dispatch: any, getState: () => IKubeCardsStore) => {
        await dispatch(gamesGet());

        const state = getState();

        const existingGameId = Object.keys(state.games.existing)[0];

        if (existingGameId) {
            await dispatch(playSetGameId(existingGameId));

            await dispatch(playMoveNext(KubeCardsPlayState.Playing));
        } else {
            await dispatch(playMoveNext(KubeCardsPlayState.ChooseDeck));
        }
    };
};
