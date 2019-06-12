import { IGameState } from "../Models";

export interface IGameStore extends IGameState {
}

export interface IGamesStore {
    existing: IGameStore[];
    isRefreshing: boolean;
}

const defaultStore: IGamesStore = {
    existing: [],
    isRefreshing: false
};

export default function gamesReducer(state: IGamesStore = defaultStore, action: any): IGamesStore {
    switch (action.type) {
        case 'KUBE_CARDS_GAMES_SET_IS_REFRESHING':
            return { ...state, isRefreshing: action.isRefreshing };
        case 'KUBE_CARDS_GAMES_SET_EXISTING':
            return { ...state, existing: action.existing }
    }

    return state;
}
