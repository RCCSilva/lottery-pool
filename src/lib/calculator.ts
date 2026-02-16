/**
 * Lottery Pool (Bolão) calculator - object-oriented implementation.
 * Pure logic, side-effect free, easily unit-testable.
 */

import {
  MEGA_SENA_PRICES,
  BettingFormCalculationResult,
} from '@/types/calculator'
import {
  Game,
  BettingForm,
  LotteryPool,
  GamePrice,
  MAX_GAMES_PER_BETTING_FORM,
  MINIMUM_PRICE_PER_QUOTE,
} from '@/types/domain'

/**
 * Result with minimum cost for one volante (extended calculation result)
 */
export interface CalculationResultWithMinCost extends BettingFormCalculationResult {
  minCostForOneVolante: number
}

/**
 * Processed calculation results split by budget
 */
export interface ProcessedCalculationResults {
  withinBudget: CalculationResultWithMinCost[]
  overBudget: CalculationResultWithMinCost[]
}

/**
 * Grouped game info for display
 */
export interface GroupedGame {
  dezenas: number
  price: number
  count: number
}

/**
 * Lottery Pool Calculator
 * Encapsulates all calculation logic for the Bolão system.
 */
export class LotteryCalculator {
  constructor(
    private readonly prices: GamePrice[] = MEGA_SENA_PRICES
  ) {}

  /**
   * Calculate possible betting forms for a given total amount and number of quotes.
   * A volante can have 1, 2, or 3 games (not necessarily full) - we use all games we can afford.
   */
  calculateBettingFormResults(
    totalAmount: number,
    numberOfQuotes: number
  ): BettingFormCalculationResult[] {
    return this.prices.map((gamePrice) => {
      const gamesPossible = Math.floor(totalAmount / gamePrice.price)
      // Volantes needed to hold these games (each holds max 3)
      const bettingFormsPossible =
        gamesPossible > 0 ? Math.ceil(gamesPossible / MAX_GAMES_PER_BETTING_FORM) : 0
      const actualGamesUsed = gamesPossible
      const totalCost = actualGamesUsed * gamePrice.price
      const pricePerQuote = numberOfQuotes > 0 ? totalCost / numberOfQuotes : 0
      const remainingMoney = totalAmount - totalCost
      const isValid = pricePerQuote >= MINIMUM_PRICE_PER_QUOTE

      return {
        dezenas: gamePrice.dezenas,
        pricePerGame: gamePrice.price,
        bettingFormsPossible,
        actualGamesUsed,
        totalCost,
        pricePerQuote,
        remainingMoney,
        isValid,
      }
    })
  }

  /**
   * Process calculation results: add minCostForOneVolante and split into within/over budget
   */
  processCalculationResults(
    totalAmount: number,
    numberOfQuotes: number
  ): ProcessedCalculationResults {
    const allResults = this.calculateBettingFormResults(totalAmount, numberOfQuotes)

    const resultsWithMinCost: CalculationResultWithMinCost[] = allResults.map((result) => ({
      ...result,
      // Minimum cost for 1 volante = 1 game (volante can have 1-3 games)
      minCostForOneVolante: result.pricePerGame,
    }))

    const withinBudget = resultsWithMinCost
      .filter((result) => result.bettingFormsPossible > 0)
      .sort((a, b) => a.bettingFormsPossible - b.bettingFormsPossible)

    const overBudget = resultsWithMinCost
      .filter((result) => result.minCostForOneVolante > totalAmount)
      .sort((a, b) => a.minCostForOneVolante - b.minCostForOneVolante)

    return { withinBudget, overBudget }
  }

  /**
   * Build a complete lottery pool from selected games
   */
  createLotteryPoolFromGames(games: Game[], quotes: number): LotteryPool | null {
    if (games.length === 0) return null

    const bettingForms = BettingFormDistributor.distribute(games, quotes)
    const totalCost = bettingForms.reduce((sum, bf) => sum + bf.totalCost, 0)
    const totalGames = games.length
    const totalVolantes = bettingForms.length

    const firstQuotes = bettingForms[0]?.quotes
    const allSameQuotes = bettingForms.every((bf) => bf.quotes === firstQuotes)

    return {
      bettingForms,
      totalCost,
      totalGames,
      totalVolantes,
      totalQuotes: allSameQuotes ? firstQuotes : undefined,
    }
  }
}

/**
 * Currency formatting utilities (stateless)
 */
export class CurrencyFormatter {
  static format(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  static formatInput(value: string): string {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `R$ ${formatted}`
  }

  static parse(value: string): number {
    const numbers = value.replace(/\D/g, '')
    return parseInt(numbers) || 0
  }
}

/**
 * Result analysis utilities (operate on calculation results)
 */
export class ResultAnalyzer {
  static findOptimal(
    withinBudget: CalculationResultWithMinCost[]
  ): CalculationResultWithMinCost | null {
    if (withinBudget.length === 0) return null
    return withinBudget.reduce((best, current) => {
      if (current.bettingFormsPossible < best.bettingFormsPossible) return current
      if (current.bettingFormsPossible === best.bettingFormsPossible && current.dezenas > best.dezenas) return current
      return best
    })
  }

  static findBestValue(
    withinBudget: CalculationResultWithMinCost[]
  ): CalculationResultWithMinCost | null {
    if (withinBudget.length === 0) return null
    return withinBudget.reduce((best, current) =>
      current.bettingFormsPossible > best.bettingFormsPossible ? current : best
    )
  }

  static createOptimalGames(result: CalculationResultWithMinCost): Game[] {
    const game: Game = {
      dezenas: result.dezenas,
      price: result.pricePerGame,
    }
    return Array(result.actualGamesUsed).fill(game)
  }

  static getOptimalResultKey(
    result: CalculationResultWithMinCost,
    numberOfQuotes: number
  ): string {
    return `${result.dezenas}-${result.actualGamesUsed}-${numberOfQuotes}`
  }
}

/**
 * Betting form distribution (games → volantes)
 */
export class BettingFormDistributor {
  static distribute(games: Game[], quotes: number): BettingForm[] {
    if (games.length === 0) return []

    const gamesByDezenas = new Map<number, Game[]>()
    games.forEach((game) => {
      if (!gamesByDezenas.has(game.dezenas)) {
        gamesByDezenas.set(game.dezenas, [])
      }
      gamesByDezenas.get(game.dezenas)!.push(game)
    })

    const bettingForms: BettingForm[] = []

    gamesByDezenas.forEach((gamesGroup) => {
      for (let i = 0; i < gamesGroup.length; i += MAX_GAMES_PER_BETTING_FORM) {
        const volanteGames = gamesGroup.slice(i, i + MAX_GAMES_PER_BETTING_FORM)
        const totalCost = volanteGames.reduce((sum, game) => sum + game.price, 0)
        const pricePerQuote = quotes > 0 ? totalCost / quotes : 0
        const isValid = pricePerQuote >= MINIMUM_PRICE_PER_QUOTE

        bettingForms.push({
          games: volanteGames,
          quotes,
          totalCost,
          pricePerQuote,
          isValid,
        })
      }
    })

    return bettingForms
  }
}

/**
 * Game grouping for display
 */
export class GameGrouper {
  static byDezenas(games: Game[]): GroupedGame[] {
    const groups = new Map<number, GroupedGame>()

    games.forEach((game) => {
      const existing = groups.get(game.dezenas)
      if (existing) {
        existing.count++
      } else {
        groups.set(game.dezenas, {
          dezenas: game.dezenas,
          price: game.price,
          count: 1,
        })
      }
    })

    return Array.from(groups.values()).sort((a, b) => a.dezenas - b.dezenas)
  }
}

/**
 * WhatsApp share message builder
 */
export class ShareMessageBuilder {
  static buildWhatsAppMessage(
    bettingForms: BettingForm[],
    numberOfParticipants: number,
    totalCost: number
  ): string {
    const actualContributionPerParticipant =
      numberOfParticipants > 0 ? totalCost / numberOfParticipants : 0

    const lines: string[] = []
    lines.push('*Bolao da Mega-Sena*')
    lines.push('')
    lines.push(`Participantes: ${numberOfParticipants}`)
    lines.push(
      `Contribuição por Participante: ${CurrencyFormatter.format(actualContributionPerParticipant)}`
    )
    lines.push(`Valor Total: ${CurrencyFormatter.format(totalCost)}`)
    lines.push(`Total de Volantes: ${bettingForms.length}`)
    lines.push('')
    lines.push('*Detalhes dos Volantes:*')

    bettingForms.forEach((bettingForm) => {
      const dezenas = bettingForm.games[0]?.dezenas || 0
      const numBettingForms = Math.floor(
        bettingForm.games.length / MAX_GAMES_PER_BETTING_FORM
      )
      const status = bettingForm.isValid ? 'OK' : 'ATENCAO'
      lines.push('')
      lines.push(`${status} - *${dezenas} dezenas*`)
      lines.push(`   - Volantes: ${numBettingForms}`)
      lines.push(`   - Jogos: ${bettingForm.games.length}`)
      lines.push(`   - Custo: ${CurrencyFormatter.format(bettingForm.totalCost)}`)
      lines.push(`   - Preco por cota: ${CurrencyFormatter.format(bettingForm.pricePerQuote)}`)
      if (!bettingForm.isValid) {
        lines.push(
          `   ATENCAO: Preco por cota abaixo do minimo (R$ ${CurrencyFormatter.format(MINIMUM_PRICE_PER_QUOTE)})`
        )
      }
    })

    if (bettingForms.some((bf) => !bf.isValid)) {
      lines.push('')
      lines.push(
        '*ATENCAO:* Alguns volantes tem preco por cota abaixo do minimo de R$ 12,00'
      )
    }

    return lines.join('\n')
  }
}

// Default instance for convenience
const defaultCalculator = new LotteryCalculator()

// Backward-compatible function exports
export const formatCurrency = CurrencyFormatter.format
export const formatCurrencyInput = CurrencyFormatter.formatInput
export const parseCurrencyInput = CurrencyFormatter.parse

export function calculateBettingFormResults(
  totalAmount: number,
  numberOfQuotes: number,
  prices?: GamePrice[]
): BettingFormCalculationResult[] {
  const calculator = prices ? new LotteryCalculator(prices) : defaultCalculator
  return calculator.calculateBettingFormResults(totalAmount, numberOfQuotes)
}

export function processCalculationResults(
  totalAmount: number,
  numberOfQuotes: number
): ProcessedCalculationResults {
  return defaultCalculator.processCalculationResults(totalAmount, numberOfQuotes)
}

export const findOptimalResult = ResultAnalyzer.findOptimal
export const findBestValue = ResultAnalyzer.findBestValue
export const createOptimalGames = ResultAnalyzer.createOptimalGames
export const getOptimalResultKey = ResultAnalyzer.getOptimalResultKey

export const distributeGamesIntoBettingForms = BettingFormDistributor.distribute

export function createLotteryPoolFromGames(
  games: Game[],
  quotes: number
): LotteryPool | null {
  return defaultCalculator.createLotteryPoolFromGames(games, quotes)
}

export const groupGamesByDezenas = GameGrouper.byDezenas

export function buildWhatsAppShareMessage(
  bettingForms: BettingForm[],
  numberOfParticipants: number,
  totalCost: number
): string {
  return ShareMessageBuilder.buildWhatsAppMessage(
    bettingForms,
    numberOfParticipants,
    totalCost
  )
}
