import { KubeCardsPlayOpponentType, KubeCardsPlayState } from "../reducers/PlayReducer";
import { gamesAddExisting, gamesGet } from "./GamesActions";
import { IKubeCardsStore } from "../KubeCardsStore";
import gamesService from "../services/GamesService";
import { IGameState, IPlayer } from "../Models";

const playSetGameId = (gameId: string | undefined) => ({
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

function isPlayerOutOfCards(player: IPlayer): boolean {
    return !player.handCards || player.handCards.length === 0;
}

function isGameEnded(game: IGameState) {
    return isPlayerOutOfCards(game.player1) && isPlayerOutOfCards(game.player2);
}

function getMatchingPlayer(game: IGameState, userId: string): IPlayer | undefined {
    if (game.player1.userId === userId) {
        return game.player1;
    } else if (game.player2.userId === userId) {
        return game.player2;
    } else {
        return undefined;
    }
}

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

        if (isGameEnded(updatedGame)) {
            await dispatch(playMoveNext(KubeCardsPlayState.Ended));
        }
    };
};

export const playCompleteGame = () => {
    return async (dispatch: any, getState: () => IKubeCardsStore) => {
        const state = getState();

        const { gameId } = state.play;

        if (!gameId) {
            throw new Error('Cannot complete a game if one is not in progress.');
        }

        const updatedGame = await gamesService.completeGame(gameId);

        await dispatch(gamesAddExisting(updatedGame));

        await dispatch(playMoveNext(KubeCardsPlayState.ChooseOpponent));
        await dispatch(playSetGameId(undefined));
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

        const { userId } = state.userAuth;

        if (!userId) {
            throw new Error('Cannot resume a game before logging in.');
        }

        const existingGameId = Object.keys(state.games.existing)[0];
        const existingGame = state.games.existing[existingGameId];

        if (existingGame) {
            const player = getMatchingPlayer(existingGame, userId);

            if (!player) {
                throw new Error('Cannot resume a game that does not include the current user.');
            }

            // There's an existing game; see if it's ended...
            if (isGameEnded(existingGame)) {
                // The existing game is done; see if the user's completed it...
                if (player.completed) {
                    // The user's completed the game, so have the user start another one...
                    await dispatch(playMoveNext(KubeCardsPlayState.ChooseOpponent));
                } else {
                    // The user's not completed the game, so show the user its outcome...
                    await dispatch(playSetGameId(existingGame.gameId));
                    await dispatch(playMoveNext(KubeCardsPlayState.Ended));
                }
            } else {
                // The existing game hasn't ended, so keep playing...
                await dispatch(playSetGameId(existingGame.gameId));
                await dispatch(playMoveNext(KubeCardsPlayState.Playing));
            }
        } else {
            // No existing game, so have the user start one...
            await dispatch(playMoveNext(KubeCardsPlayState.ChooseOpponent));
        }
    };
};
