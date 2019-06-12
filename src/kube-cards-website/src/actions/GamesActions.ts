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

export const gamesGet = () => {
    return async (dispatch: any) => {
        const existingGames = await gamesService.getGames();

        dispatch(gamesSetExisting(existingGames));
    };
}