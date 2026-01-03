/**
 * Domain types for Lottery Pool (Bolão) system
 */

/**
 * A Game represents a single lottery ticket with a specific number of dezenas (numbers)
 */
export interface Game {
  /** Number of dezenas (numbers) in this game (6-20 for Mega-Sena) */
  dezenas: number;
  /** Price per game/ticket */
  price: number;
}

/**
 * A Betting Form (Volante) can contain at most 3 games.
 * All games in a Volante MUST have the same number of dezenas.
 */
export interface BettingForm {
  /** Games in this betting form (max 3) */
  games: Game[];
  /** Number of quotes (cotas) for this betting form */
  quotes: number;
  /** Total cost of all games in this betting form */
  totalCost: number;
  /** Price per quote (totalCost / quotes) - MUST be at least R$ 12.00 */
  pricePerQuote: number;
  /** Whether this betting form is valid (pricePerQuote >= 12.00) */
  isValid: boolean;
}

/**
 * A Lottery Pool (Bolão) is composed of one or more Betting Forms (Volantes).
 * In the future, a Bolão can have multiple Volantes with different game sizes and quotes.
 */
export interface LotteryPool {
  /** Betting forms (Volantes) that make up this lottery pool */
  bettingForms: BettingForm[];
  /** Total cost of the entire lottery pool */
  totalCost: number;
  /** Total number of games across all betting forms */
  totalGames: number;
  /** Total number of volantes (betting forms) */
  totalVolantes: number;
  /** Total number of quotes (if all volantes have the same quotes, otherwise undefined) */
  totalQuotes?: number;
}

/**
 * Price table for Mega-Sena games
 */
export interface GamePrice {
  dezenas: number;
  price: number;
}

/**
 * Minimum price per quote required to process a betting form
 */
export const MINIMUM_PRICE_PER_QUOTE = 12.0;

/**
 * Maximum number of games allowed per betting form (Volante)
 */
export const MAX_GAMES_PER_BETTING_FORM = 3;

