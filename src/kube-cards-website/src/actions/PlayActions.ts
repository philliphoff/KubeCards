import { KubeCardsPlayOpponentType, KubeCardsPlayState } from "../reducers/PlayReducer";

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
