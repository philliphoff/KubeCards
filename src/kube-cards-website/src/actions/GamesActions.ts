import gamesService from "../services/GamesService";
import { IGameState } from "../Models";

const gamesSetIsRefreshing = (isRefreshing: boolean) => ({
    type: 'KUBE_CARDS_GAMES_SET_IS_REFRESHING',
    isRefreshing
});

const gamesSetExisting = (existing: IGameState[]) => ({
    type: 'KUBE_CARDS_GAMES_SET_EXISTING',
    existing
});

export const gamesCreate = (deckId: string) => {
    return async (dispatch: any) => {
        await dispatch(gamesSetIsRefreshing(true));

        try {
            const newGame = await gamesService.createGame(deckId);
            
            await dispatch(gamesSetExisting([ newGame ]));
        }
        finally {
            await dispatch(gamesSetIsRefreshing(false));
        }
    }
}

export const gamesGet = () => {
    return async (dispatch: any) => {
        await dispatch(gamesSetIsRefreshing(true));
        
        try {
            const existingGames = await gamesService.getGames();

            await dispatch(gamesSetExisting(existingGames));
        }
        finally {
            await dispatch(gamesSetIsRefreshing(false));
        }
    };
}