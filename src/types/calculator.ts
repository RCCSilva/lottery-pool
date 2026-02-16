import { Game, BettingForm, GamePrice, MINIMUM_PRICE_PER_QUOTE, MAX_GAMES_PER_BETTING_FORM } from './domain'

/**
 * Mega-Sena price table
 */
export const MEGA_SENA_PRICES: GamePrice[] = [
  { dezenas: 6, price: 6.0 },
  { dezenas: 7, price: 42.0 },
  { dezenas: 8, price: 168.0 },
  { dezenas: 9, price: 504.0 },
  { dezenas: 10, price: 1260.0 },
  { dezenas: 11, price: 2772.0 },
  { dezenas: 12, price: 5544.0 },
  { dezenas: 13, price: 10296.0 },
  { dezenas: 14, price: 18018.0 },
  { dezenas: 15, price: 30030.0 },
  { dezenas: 16, price: 48048.0 },
  { dezenas: 17, price: 74256.0 },
  { dezenas: 18, price: 111384.0 },
  { dezenas: 19, price: 162792.0 },
  { dezenas: 20, price: 232560.0 },
]

/**
 * Result of calculating possible betting forms for a given configuration
 */
export interface BettingFormCalculationResult {
  /** Number of dezenas for games in this betting form */
  dezenas: number;
  /** Price per game */
  pricePerGame: number;
  /** Number of volantes needed (each holds up to 3 games) */
  bettingFormsPossible: number;
  /** Actual number of games we can afford and will use */
  actualGamesUsed: number;
  /** Total cost for all betting forms */
  totalCost: number;
  /** Price per quote */
  pricePerQuote: number;
  /** Remaining money after purchasing these betting forms */
  remainingMoney: number;
  /** Whether this configuration is valid (pricePerQuote >= MINIMUM_PRICE_PER_QUOTE) */
  isValid: boolean;
}

/**
 * Creates a BettingForm from a calculation result.
 * Note: This creates a single BettingForm entry that represents all betting forms
 * of this type. The games array contains all games across all betting forms.
 */
export function createBettingFormFromResult(
  result: BettingFormCalculationResult,
  quotes: number
): BettingForm {
  const game: Game = {
    dezenas: result.dezenas,
    price: result.pricePerGame,
  }

  // Create games array with all games (bettingFormsPossible * MAX_GAMES_PER_BETTING_FORM)
  // All games have the same dezenas (as required by the business rule)
  const games: Game[] = Array(result.actualGamesUsed).fill(game)

  const totalCost = result.totalCost
  const pricePerQuote = totalCost / quotes
  const isValid = pricePerQuote >= MINIMUM_PRICE_PER_QUOTE

  return {
    games,
    quotes,
    totalCost,
    pricePerQuote,
    isValid,
  }
}
