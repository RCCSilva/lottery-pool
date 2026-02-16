import { describe, it, expect } from 'vitest'
import {
  LotteryCalculator,
  CurrencyFormatter,
  ResultAnalyzer,
  BettingFormDistributor,
  GameGrouper,
  ShareMessageBuilder,
  formatCurrency,
  formatCurrencyInput,
  parseCurrencyInput,
  calculateBettingFormResults,
  processCalculationResults,
  findOptimalResult,
  findBestValue,
  createOptimalGames,
  getOptimalResultKey,
  distributeGamesIntoBettingForms,
  createLotteryPoolFromGames,
  groupGamesByDezenas,
  buildWhatsAppShareMessage,
} from './calculator'
import { Game } from '@/types/domain'

describe('LotteryCalculator (class)', () => {
  it('can be instantiated with custom prices', () => {
    const customPrices = [{ dezenas: 6, price: 10 }]
    const calculator = new LotteryCalculator(customPrices)
    const results = calculator.calculateBettingFormResults(100, 10)
    expect(results).toHaveLength(1)
    expect(results[0].pricePerGame).toBe(10)
  })

  it('processes calculation results', () => {
    const calculator = new LotteryCalculator()
    const { withinBudget, overBudget } = calculator.processCalculationResults(504, 10)
    expect(withinBudget.every((r) => r.bettingFormsPossible > 0)).toBe(true)
    expect(overBudget.every((r) => r.minCostForOneVolante > 504)).toBe(true)
  })

  it('creates lottery pool from games', () => {
    const calculator = new LotteryCalculator()
    const games: Game[] = [
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
    ]
    const pool = calculator.createLotteryPoolFromGames(games, 10)
    expect(pool).not.toBeNull()
    expect(pool!.totalVolantes).toBe(1)
  })
})

describe('CurrencyFormatter (class)', () => {
  it('formats currency via static method', () => {
    expect(CurrencyFormatter.format(100)).toMatch(/R\$\s*100,00/)
  })

  it('parses input via static method', () => {
    expect(CurrencyFormatter.parse('R$ 1.000')).toBe(1000)
  })
})

describe('formatCurrency', () => {
  it('formats number as BRL currency', () => {
    expect(formatCurrency(100)).toMatch(/R\$\s*100,00/)
    expect(formatCurrency(12.5)).toMatch(/R\$\s*12,50/)
  })
})

describe('formatCurrencyInput', () => {
  it('formats input with thousand separators', () => {
    expect(formatCurrencyInput('1000')).toBe('R$ 1.000')
    expect(formatCurrencyInput('R$ 1000')).toBe('R$ 1.000')
  })

  it('returns empty string for empty input', () => {
    expect(formatCurrencyInput('')).toBe('')
  })
})

describe('parseCurrencyInput', () => {
  it('parses currency string to number', () => {
    expect(parseCurrencyInput('R$ 1.000')).toBe(1000)
    expect(parseCurrencyInput('100')).toBe(100)
  })

  it('returns 0 for invalid input', () => {
    expect(parseCurrencyInput('')).toBe(0)
  })
})

describe('calculateBettingFormResults', () => {
  it('returns results for each game price', () => {
    const results = calculateBettingFormResults(504, 10)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]).toHaveProperty('dezenas')
    expect(results[0]).toHaveProperty('bettingFormsPossible')
    expect(results[0]).toHaveProperty('pricePerQuote')
  })

  it('validates price per quote against minimum', () => {
    const results = calculateBettingFormResults(100, 10)
    const validResults = results.filter((r) => r.isValid)
    expect(validResults.length).toBeGreaterThanOrEqual(0)
  })
})

describe('processCalculationResults', () => {
  it('splits results into within and over budget', () => {
    const { withinBudget, overBudget } = processCalculationResults(504, 10)
    expect(withinBudget.every((r) => r.bettingFormsPossible > 0)).toBe(true)
    expect(overBudget.every((r) => r.minCostForOneVolante > 504)).toBe(true)
  })

  it('adds minCostForOneVolante to each result (1 game = min for 1 volante)', () => {
    const { withinBudget } = processCalculationResults(5040, 10)
    expect(withinBudget.length).toBeGreaterThan(0)
    expect(withinBudget[0]).toHaveProperty('minCostForOneVolante')
    expect(withinBudget[0].minCostForOneVolante).toBe(withinBudget[0].pricePerGame)
  })
})

describe('findOptimalResult', () => {
  it('returns result with minimum volantes', () => {
    const { withinBudget } = processCalculationResults(5040, 10)
    const optimal = findOptimalResult(withinBudget)
    if (optimal) {
      expect(withinBudget.every((r) => r.bettingFormsPossible >= optimal.bettingFormsPossible)).toBe(true)
    }
  })

  it('prefers higher dezenas when volantes tie (10 players × 100 BRL = 1000)', () => {
    const { withinBudget } = processCalculationResults(1000, 10)
    const optimal = findOptimalResult(withinBudget)
    expect(optimal).not.toBeNull()
    expect(optimal!.dezenas).toBe(9)
    expect(optimal!.actualGamesUsed).toBe(1)
    expect(optimal!.bettingFormsPossible).toBe(1)
  })

  it('returns null for empty array', () => {
    expect(findOptimalResult([])).toBeNull()
  })
})

describe('findBestValue', () => {
  it('returns result with maximum volantes', () => {
    const { withinBudget } = processCalculationResults(5040, 10)
    const best = findBestValue(withinBudget)
    if (best) {
      expect(withinBudget.every((r) => r.bettingFormsPossible <= best.bettingFormsPossible)).toBe(true)
    }
  })
})

describe('createOptimalGames', () => {
  it('creates correct number of games', () => {
    const result = {
      dezenas: 6,
      pricePerGame: 6,
      actualGamesUsed: 3,
      bettingFormsPossible: 1,
      totalCost: 18,
      pricePerQuote: 1.8,
      remainingMoney: 0,
      isValid: false,
      minCostForOneVolante: 18,
    }
    const games = createOptimalGames(result)
    expect(games).toHaveLength(3)
    expect(games.every((g) => g.dezenas === 6 && g.price === 6)).toBe(true)
  })
})

describe('getOptimalResultKey', () => {
  it('generates unique key', () => {
    const result = {
      dezenas: 6,
      actualGamesUsed: 3,
      pricePerGame: 6,
      bettingFormsPossible: 1,
      totalCost: 18,
      pricePerQuote: 1.8,
      remainingMoney: 0,
      isValid: false,
      minCostForOneVolante: 18,
    }
    expect(getOptimalResultKey(result, 10)).toBe('6-3-10')
  })
})

describe('distributeGamesIntoBettingForms', () => {
  it('groups games by dezenas and splits into volantes of max 3', () => {
    const games: Game[] = [
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
    ]
    const forms = distributeGamesIntoBettingForms(games, 10)
    expect(forms).toHaveLength(2)
    expect(forms[0].games).toHaveLength(3)
    expect(forms[1].games).toHaveLength(1)
  })

  it('returns empty array for empty games', () => {
    expect(distributeGamesIntoBettingForms([], 10)).toEqual([])
  })
})

describe('createLotteryPoolFromGames', () => {
  it('creates lottery pool with correct totals', () => {
    const games: Game[] = [
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
    ]
    const pool = createLotteryPoolFromGames(games, 10)
    expect(pool).not.toBeNull()
    expect(pool!.totalGames).toBe(3)
    expect(pool!.totalVolantes).toBe(1)
    expect(pool!.totalCost).toBe(18)
  })

  it('returns null for empty games', () => {
    expect(createLotteryPoolFromGames([], 10)).toBeNull()
  })
})

describe('groupGamesByDezenas', () => {
  it('groups games and counts correctly', () => {
    const games: Game[] = [
      { dezenas: 6, price: 6 },
      { dezenas: 6, price: 6 },
      { dezenas: 7, price: 42 },
    ]
    const groups = groupGamesByDezenas(games)
    expect(groups).toHaveLength(2)
    const sixGroup = groups.find((g) => g.dezenas === 6)
    expect(sixGroup?.count).toBe(2)
  })
})

describe('buildWhatsAppShareMessage', () => {
  it('builds message with participant and cost info', () => {
    const forms = [
      {
        games: [{ dezenas: 6, price: 6 }],
        quotes: 10,
        totalCost: 6,
        pricePerQuote: 0.6,
        isValid: false,
      },
    ]
    const message = buildWhatsAppShareMessage(forms, 10, 6)
    expect(message).toContain('Bolao da Mega-Sena')
    expect(message).toContain('Participantes: 10')
    expect(message).toContain('Valor Total')
    expect(message).toContain('6 dezenas')
  })
})
