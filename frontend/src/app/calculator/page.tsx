'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import {
  MEGA_SENA_PRICES,
  BettingFormCalculationResult,
  createBettingFormFromResult,
} from '@/types/calculator'
import { Game, BettingForm, LotteryPool, MAX_GAMES_PER_BETTING_FORM, MINIMUM_PRICE_PER_QUOTE } from '@/types/domain'
import { TERMS_VERSION, TERMS_ACCEPTANCE_KEY } from '@/constants/terms'

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`

const ResultsCard = styled(Card)`
  margin-top: 2rem;
`

const ResultsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`

const CollapsibleTitle = styled(ResultsTitle)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  margin-bottom: 0;
  padding: 1rem 0;
  margin-top: 0;

  &:hover {
    color: #667eea;
  }
`

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  font-size: 1.2rem;
  transition: transform 0.2s;
  transform: ${(props) => (props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

const TableHeader = styled.thead`
  background: #f8f9fa;
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }

  &:hover {
    background: #e9ecef;
  }
`

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.hide-mobile {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &.mobile-only {
    display: none;
    @media (max-width: 768px) {
      display: table-cell;
    }
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
`

const TableCell = styled.td`
  padding: 1rem;
  color: #555;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }

  &.hide-mobile {
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const HighlightCell = styled(TableCell)`
  font-weight: 600;
  color: #667eea;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #999;
`

const Currency = styled.span`
  font-weight: 500;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5568d3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const AddButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #5568d3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`

const RemoveButton = styled(Button)`
  background: #e74c3c;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;

  &:hover {
    background: #c0392b;
  }
`

const QuantityButton = styled.button`
  width: 2rem;
  height: 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #5568d3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const QuantityDisplay = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  min-width: 2rem;
  text-align: center;
`

const ShareButton = styled(Button)`
  background: #25d366;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background: #20ba5a;
  }
`

const CalculateButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  width: 100%;
  margin-top: 1rem;
  display: block !important; /* Override the mobile hide rule from Button */

  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #653a91 100%);
  }

  @media (max-width: 768px) {
    display: block !important; /* Ensure it's visible on mobile */
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`

const ModalText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`

const ModalWarningBox = styled.div`
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`

const ModalWarningText = styled.p`
  font-size: 0.95rem;
  color: #856404;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const AcceptButton = styled(Button)`
  flex: 1;
  background: #28a745;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  display: block !important; /* Override mobile hide rule */
  min-height: 44px; /* Minimum touch target size for mobile */

  &:hover {
    background: #218838;
  }

  @media (max-width: 768px) {
    display: block !important; /* Ensure visible on mobile */
    padding: 1rem 1.5rem; /* Larger touch target on mobile */
  }
`

const CancelButton = styled(Button)`
  flex: 1;
  background: #6c757d;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  display: block !important; /* Override mobile hide rule */
  min-height: 44px; /* Minimum touch target size for mobile */

  &:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    display: block !important; /* Ensure visible on mobile */
    padding: 1rem 1.5rem; /* Larger touch target on mobile */
  }
`

const JogosCard = styled(Card)`
  margin-top: 2rem;
`

const JogosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const JogoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
`

const JogoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const JogoTitle = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`

const JogoDetails = styled.div`
  font-size: 0.85rem;
  color: #666;
`

const ActionCell = styled(TableCell)`
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const MobileActionCell = styled(TableCell)`
  display: none;
  text-align: center;
  padding: 0.5rem;
  vertical-align: middle;
  horizontal-align: center;

  @media (max-width: 768px) {
    display: table-cell;
  }
`

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Format a number as currency input (R$ 1.000 format, no decimals)
 */
function formatCurrencyInput(value: string): string {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Format with thousand separators
  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `R$ ${formatted}`
}

/**
 * Parse currency input string to number
 */
function parseCurrencyInput(value: string): number {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '')
  return parseInt(numbers) || 0
}

/**
 * Calculate possible betting forms for a given total amount and number of quotes
 */
function calculateBettingFormResults(
  totalAmount: number,
  numberOfQuotes: number
): BettingFormCalculationResult[] {
  return MEGA_SENA_PRICES.map((gamePrice) => {
    // Calculate how many games can be bought
    const gamesPossible = Math.floor(totalAmount / gamePrice.price)
    
    // Calculate how many complete Betting Forms (Volantes) can be made
    // Each Betting Form can have at most MAX_GAMES_PER_BETTING_FORM games
    const bettingFormsPossible = Math.floor(gamesPossible / MAX_GAMES_PER_BETTING_FORM)
    
    // Calculate actual games used (only complete Betting Forms)
    const actualGamesUsed = bettingFormsPossible * MAX_GAMES_PER_BETTING_FORM
    
    // Calculate actual cost based on complete Betting Forms
    const totalCost = actualGamesUsed * gamePrice.price
    const pricePerQuote = numberOfQuotes > 0 ? totalCost / numberOfQuotes : 0
    const remainingMoney = totalAmount - totalCost
    
    // Validate: price per quote MUST be at least MINIMUM_PRICE_PER_QUOTE
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

export default function CalculatorPage() {
  const [numberOfParticipants, setNumberOfParticipants] = useState<string>('')
  const [individualContribution, setIndividualContribution] = useState<string>('')
  const [selectedGames, setSelectedGames] = useState<Game[]>([])
  const [isOverBudgetExpanded, setIsOverBudgetExpanded] = useState<boolean>(false)
  const [lastOptimalKey, setLastOptimalKey] = useState<string>('')
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)

  // Check if user has accepted current terms version on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const acceptedVersion = localStorage.getItem(TERMS_ACCEPTANCE_KEY)
      if (acceptedVersion === TERMS_VERSION) {
        setTermsAccepted(true)
      }
    }
  }, [])

  // Parse inputs
  const numberOfParticipantsNum = parseInt(numberOfParticipants) || 0
  const individualContributionNum = parseCurrencyInput(individualContribution)
  
  // Calculate total amount from participants × individual contribution
  const totalAmountNum = numberOfParticipantsNum * individualContributionNum
  const numberOfQuotesNum = numberOfParticipantsNum

  const handleIndividualContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setIndividualContribution(formatted)
  }

  const errors = {
    numberOfParticipants: numberOfParticipantsNum < 1 && numberOfParticipants !== '',
    individualContribution: individualContributionNum <= 0 && individualContribution !== '',
  }

  const hasErrors = errors.numberOfParticipants || errors.individualContribution
  const hasValidInputs = numberOfParticipantsNum >= 1 && individualContributionNum > 0

  const calculationResults = useMemo(() => {
    if (!hasValidInputs) return { withinBudget: [], overBudget: [] }
    const allResults = calculateBettingFormResults(totalAmountNum, numberOfQuotesNum)
    
    // Calculate minimum cost for each game type (cost of 1 volante = 3 games)
    const resultsWithMinCost = allResults.map((result) => {
      const minCostForOneVolante = result.pricePerGame * MAX_GAMES_PER_BETTING_FORM
      return {
        ...result,
        minCostForOneVolante,
      }
    })
    
    // Separate into within budget and over budget
    // Within budget: can buy at least 1 volante (bettingFormsPossible > 0)
    const withinBudget = resultsWithMinCost
      .filter((result) => result.bettingFormsPossible > 0)
      .sort((a, b) => a.bettingFormsPossible - b.bettingFormsPossible)
    
    // Over budget: cannot buy even 1 volante (minCostForOneVolante > totalAmount)
    const overBudget = resultsWithMinCost
      .filter((result) => result.minCostForOneVolante > totalAmountNum)
      .sort((a, b) => a.minCostForOneVolante - b.minCostForOneVolante)
    
    return { withinBudget, overBudget }
  }, [totalAmountNum, numberOfQuotesNum, hasValidInputs])

  // Find optimal value (least betting forms possible) from within budget
  // Optimal = minimum number of volantes
  const optimalResult = calculationResults.withinBudget.length > 0 
    ? calculationResults.withinBudget.reduce((best, current) => 
        current.bettingFormsPossible < best.bettingFormsPossible ? current : best
      )
    : null

  // Find best value (most betting forms possible) from within budget (for display purposes)
  const bestValue = calculationResults.withinBudget.length > 0 
    ? calculationResults.withinBudget.reduce((best, current) => 
        current.bettingFormsPossible > best.bettingFormsPossible ? current : best
      )
    : null

  // Auto-add optimal games when inputs change
  useEffect(() => {
    if (hasValidInputs && optimalResult && optimalResult.isValid) {
      // Create a unique key for this optimal result
      const optimalKey = `${optimalResult.dezenas}-${optimalResult.actualGamesUsed}-${numberOfQuotesNum}`
      
      // Only update if the optimal result changed
      if (optimalKey !== lastOptimalKey) {
        // Add optimal games (individual games, not betting forms)
        const optimalGame: Game = {
          dezenas: optimalResult.dezenas,
          price: optimalResult.pricePerGame,
        }
        const optimalGames: Game[] = Array(optimalResult.actualGamesUsed).fill(optimalGame)
        setSelectedGames(optimalGames)
        setLastOptimalKey(optimalKey)
      }
    } else if (!hasValidInputs) {
      // Clear when inputs are invalid
      setSelectedGames([])
      setLastOptimalKey('')
    }
  }, [optimalResult, hasValidInputs, numberOfQuotesNum, lastOptimalKey])

  /**
   * Distribute games optimally into betting forms (Volantes)
   * Each Volante can have at most 3 games, all with the same dezenas
   */
  const distributeGamesIntoBettingForms = (games: Game[], quotes: number): BettingForm[] => {
    if (games.length === 0) return []

    // Group games by dezenas
    const gamesByDezenas = new Map<number, Game[]>()
    games.forEach((game) => {
      if (!gamesByDezenas.has(game.dezenas)) {
        gamesByDezenas.set(game.dezenas, [])
      }
      gamesByDezenas.get(game.dezenas)!.push(game)
    })

    const bettingForms: BettingForm[] = []

    // For each dezenas group, create betting forms
    gamesByDezenas.forEach((gamesGroup, dezenas) => {
      // Distribute games into groups of MAX_GAMES_PER_BETTING_FORM
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

  // Create Lottery Pool from selected games (distributed into betting forms)
  const lotteryPool = useMemo((): LotteryPool | null => {
    if (selectedGames.length === 0) return null

    const bettingForms = distributeGamesIntoBettingForms(selectedGames, numberOfQuotesNum)
    const totalCost = bettingForms.reduce((sum, bf) => sum + bf.totalCost, 0)
    const totalGames = selectedGames.length
    const totalVolantes = bettingForms.length

    // Check if all betting forms have the same number of quotes
    const firstQuotes = bettingForms[0]?.quotes
    const allSameQuotes = bettingForms.every((bf) => bf.quotes === firstQuotes)

    return {
      bettingForms,
      totalCost,
      totalGames,
      totalVolantes,
      totalQuotes: allSameQuotes ? firstQuotes : undefined,
    }
  }, [selectedGames, numberOfQuotesNum])

  const addGame = (dezenas: number, price: number) => {
    const game: Game = {
      dezenas,
      price,
    }
    setSelectedGames([...selectedGames, game])
  }

  const removeGame = (index: number) => {
    setSelectedGames(selectedGames.filter((_, i) => i !== index))
  }

  // Group games by dezenas
  const groupedGames = useMemo(() => {
    const groups = new Map<number, { dezenas: number; price: number; count: number }>()
    
    selectedGames.forEach((game) => {
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
  }, [selectedGames])

  const addGameToGroup = (dezenas: number, price: number) => {
    addGame(dezenas, price)
  }

  const removeGameFromGroup = (dezenas: number) => {
    // Find the first game with this dezenas and remove it
    const index = selectedGames.findIndex((game) => game.dezenas === dezenas)
    if (index !== -1) {
      removeGame(index)
    }
  }

  const shareOnWhatsApp = (bettingForms: BettingForm[]) => {
    if (!bettingForms || bettingForms.length === 0) return

    // Calculate totals from betting forms
    const totalCost = bettingForms.reduce((sum, bf) => sum + bf.totalCost, 0)
    const totalVolantes = bettingForms.length

    // Calculate actual contribution per participant based on final Bolão
    const actualContributionPerParticipant = numberOfParticipantsNum > 0 
      ? totalCost / numberOfParticipantsNum 
      : 0

    const lines: string[] = []
    lines.push('*Bolao da Mega-Sena*')
    lines.push('')
    lines.push(`Participantes: ${numberOfParticipantsNum}`)
    lines.push(`Contribuição por Participante: ${formatCurrency(actualContributionPerParticipant)}`)
    lines.push(`Valor Total: ${formatCurrency(totalCost)}`)
    lines.push(`Total de Volantes: ${totalVolantes}`)
    lines.push('')
    lines.push('*Detalhes dos Volantes:*')
    
    bettingForms.forEach((bettingForm, index) => {
      const dezenas = bettingForm.games[0]?.dezenas || 0
      const numBettingForms = Math.floor(bettingForm.games.length / MAX_GAMES_PER_BETTING_FORM)
      const status = bettingForm.isValid ? 'OK' : 'ATENCAO'
      lines.push('')
      lines.push(`${status} - *${dezenas} dezenas*`)
      lines.push(`   - Volantes: ${numBettingForms}`)
      lines.push(`   - Jogos: ${bettingForm.games.length}`)
      lines.push(`   - Custo: ${formatCurrency(bettingForm.totalCost)}`)
      lines.push(`   - Preco por cota: ${formatCurrency(bettingForm.pricePerQuote)}`)
      if (!bettingForm.isValid) {
        lines.push(`   ATENCAO: Preco por cota abaixo do minimo (R$ ${formatCurrency(MINIMUM_PRICE_PER_QUOTE)})`)
      }
    })

    if (bettingForms.some((bf) => !bf.isValid)) {
      lines.push('')
      lines.push('*ATENCAO:* Alguns volantes tem preco por cota abaixo do minimo de R$ 12,00')
    }

    const message = encodeURIComponent(lines.join('\n'))
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Container>
      <Content>
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <Link href="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>
            Termos e Serviços
          </Link>
        </div>
        <Card>
          <Title>Calculadora de Bolão</Title>
          <Subtitle>
            Calcule quantos Volantes podem ser comprados para seu Bolão da Mega-Sena
            <br />
            <small style={{ fontSize: '0.9rem', color: '#888' }}>
              Cada Volante contém até {MAX_GAMES_PER_BETTING_FORM} jogos com a mesma quantidade de dezenas.
              O preço por cota deve ser de pelo menos R$ {MINIMUM_PRICE_PER_QUOTE.toFixed(2)}.
            </small>
          </Subtitle>

          <FormGrid>
            <FormGroup>
              <Label htmlFor="numberOfParticipants">Número de Participantes</Label>
              <Input
                id="numberOfParticipants"
                type="number"
                min="1"
                inputMode="numeric"
                placeholder="Ex: 10"
                value={numberOfParticipants}
                onChange={(e) => setNumberOfParticipants(e.target.value)}
              />
              {errors.numberOfParticipants && (
                <ErrorMessage>O número de participantes deve ser pelo menos 1</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="individualContribution">Contribuição Individual (R$)</Label>
              <Input
                id="individualContribution"
                type="text"
                placeholder="Ex: R$ 100"
                inputMode="numeric"
                value={individualContribution}
                onChange={handleIndividualContributionChange}
              />
              {errors.individualContribution && (
                <ErrorMessage>A contribuição individual deve ser maior que zero</ErrorMessage>
              )}
            </FormGroup>
          </FormGrid>

          {hasValidInputs && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f7ff', borderRadius: '8px', textAlign: 'center' }}>
              <strong>Orçamento Total:</strong> <span style={{ fontSize: '1.2rem', color: '#667eea' }}>{formatCurrency(totalAmountNum)}</span>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                {numberOfParticipantsNum} participantes × {formatCurrency(individualContributionNum)} = {formatCurrency(totalAmountNum)}
              </div>
            </div>
          )}

          {!termsAccepted && (
            <CalculateButton
              onClick={() => setShowTermsModal(true)}
              disabled={!hasValidInputs}
            >
              Calcular
            </CalculateButton>
          )}
        </Card>

        {termsAccepted && hasValidInputs && (calculationResults.withinBudget.length > 0 || calculationResults.overBudget.length > 0) && (
          <>
            {calculationResults.withinBudget.length > 0 && (
              <ResultsCard>
                <ResultsTitle>Jogos Dentro do Orçamento</ResultsTitle>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Dezenas</TableHeaderCell>
                      <TableHeaderCell>Preço por Jogo</TableHeaderCell>
                      <TableHeaderCell className="hide-mobile">Jogos Possíveis</TableHeaderCell>
                      <TableHeaderCell className="hide-mobile">Volantes Possíveis</TableHeaderCell>
                      <TableHeaderCell className="hide-mobile">Ação</TableHeaderCell>
                      <TableHeaderCell className="mobile-only" style={{ width: '60px' }}></TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {calculationResults.withinBudget.map((result) => {
                      return (
                        <TableRow key={result.dezenas}>
                          <TableCell>
                            {result.dezenas}
                          </TableCell>
                          <TableCell>
                            <Currency>{formatCurrency(result.pricePerGame)}</Currency>
                          </TableCell>
                          <TableCell className="hide-mobile">
                            {Math.floor(totalAmountNum / result.pricePerGame)}
                          </TableCell>
                          <TableCell className="hide-mobile">
                            {result.bettingFormsPossible}
                          </TableCell>
                          <ActionCell>
                            <Button
                              onClick={() => addGame(result.dezenas, result.pricePerGame)}
                            >
                              Adicionar Jogo
                            </Button>
                          </ActionCell>
                          <MobileActionCell>
                            <AddButton
                              onClick={() => addGame(result.dezenas, result.pricePerGame)}
                              title="Adicionar Jogo"
                            >
                              +
                            </AddButton>
                          </MobileActionCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>
              </ResultsCard>
            )}

            {calculationResults.overBudget.length > 0 && (
              <ResultsCard>
                <CollapsibleTitle onClick={() => setIsOverBudgetExpanded(!isOverBudgetExpanded)}>
                  <span>Jogos Fora do Orçamento ({calculationResults.overBudget.length})</span>
                  <ExpandIcon isExpanded={isOverBudgetExpanded}>▼</ExpandIcon>
                </CollapsibleTitle>
                {isOverBudgetExpanded && (
                  <div style={{ marginTop: '1rem' }}>
                    <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Dezenas</TableHeaderCell>
                      <TableHeaderCell>Preço por Jogo</TableHeaderCell>
                      <TableHeaderCell className="hide-mobile">Custo Mínimo (1 Volante)</TableHeaderCell>
                      <TableHeaderCell className="hide-mobile">Ação</TableHeaderCell>
                      <TableHeaderCell className="mobile-only" style={{ width: '60px' }}></TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {calculationResults.overBudget.map((result) => {
                      const minCostForOneVolante = result.minCostForOneVolante || (result.pricePerGame * MAX_GAMES_PER_BETTING_FORM)
                      return (
                        <TableRow key={result.dezenas}>
                          <TableCell>
                            {result.dezenas}
                          </TableCell>
                          <TableCell>
                            <Currency>{formatCurrency(result.pricePerGame)}</Currency>
                          </TableCell>
                          <TableCell className="hide-mobile">
                            <Currency>{formatCurrency(minCostForOneVolante)}</Currency>
                            <span style={{ fontSize: '0.8rem', color: '#999', marginLeft: '0.25rem' }}>(mínimo)</span>
                          </TableCell>
                          <ActionCell>
                            <Button
                              onClick={() => addGame(result.dezenas, result.pricePerGame)}
                            >
                              Adicionar Jogo
                            </Button>
                          </ActionCell>
                          <MobileActionCell>
                            <AddButton
                              onClick={() => addGame(result.dezenas, result.pricePerGame)}
                              title="Adicionar Jogo"
                            >
                              +
                            </AddButton>
                          </MobileActionCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>
                  </div>
                )}
              </ResultsCard>
            )}
          </>
        )}

        {termsAccepted && hasValidInputs && (
          <JogosCard>
            <ResultsTitle>Bolão</ResultsTitle>
            
            {/* Show grouped games with + and - buttons */}
            {groupedGames.length > 0 ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#333' }}>
                  Jogos Selecionados ({selectedGames.length} total)
                </h3>
                <JogosList>
                  {groupedGames.map((group) => (
                    <JogoItem key={`group-${group.dezenas}`}>
                      <JogoInfo>
                        <JogoTitle>
                          {group.dezenas} dezenas - {formatCurrency(group.price)} por jogo
                        </JogoTitle>
                        <JogoDetails>
                          Total: {formatCurrency(group.price * group.count)} ({group.count} jogo{group.count !== 1 ? 's' : ''})
                        </JogoDetails>
                      </JogoInfo>
                      <QuantityControls>
                        <QuantityButton
                          onClick={() => removeGameFromGroup(group.dezenas)}
                          disabled={group.count === 0}
                        >
                          -
                        </QuantityButton>
                        <QuantityDisplay>{group.count}</QuantityDisplay>
                        <QuantityButton
                          onClick={() => addGameToGroup(group.dezenas, group.price)}
                        >
                          +
                        </QuantityButton>
                      </QuantityControls>
                    </JogoItem>
                  ))}
                </JogosList>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                Nenhum jogo selecionado. Adicione jogos das tabelas acima.
              </div>
            )}

            {/* Show distributed Volantes */}
            {lotteryPool && selectedGames.length > 0 && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#333' }}>Distribuição em Volantes ({lotteryPool.totalVolantes})</h3>
                  <JogosList>
                    {lotteryPool.bettingForms.map((bettingForm, index) => {
                      const dezenas = bettingForm.games[0]?.dezenas || 0
                      return (
                        <JogoItem key={`volante-${index}`}>
                          <JogoInfo>
                            <JogoTitle>
                              Volante {index + 1}: {dezenas} dezenas ({bettingForm.games.length} jogos)
                              {!bettingForm.isValid && (
                                <span style={{ color: '#e74c3c', marginLeft: '0.5rem' }}>
                                  ⚠️ Inválido (preço por cota &lt; R$ {formatCurrency(MINIMUM_PRICE_PER_QUOTE)})
                                </span>
                              )}
                            </JogoTitle>
                            <JogoDetails>
                              Custo: {formatCurrency(bettingForm.totalCost)} | 
                              Preço por cota: {formatCurrency(bettingForm.pricePerQuote)}
                              {bettingForm.isValid && (
                                <span style={{ color: '#27ae60', marginLeft: '0.5rem' }}>✓ Válido</span>
                              )}
                            </JogoDetails>
                          </JogoInfo>
                        </JogoItem>
                      )
                    })}
                  </JogosList>
                </div>
                {lotteryPool.bettingForms.some((bf) => !bf.isValid) && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3cd', border: '2px solid #ffc107', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#856404', marginBottom: '0.5rem' }}>
                      ⚠️ Atenção: Problemas encontrados
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#856404' }}>
                      {lotteryPool.bettingForms
                        .filter((bf) => !bf.isValid)
                        .map((bf, idx) => {
                          const dezenas = bf.games[0]?.dezenas || 0
                          return (
                            <div key={idx} style={{ marginTop: '0.25rem' }}>
                              • Volante com {dezenas} dezenas: Preço por cota ({formatCurrency(bf.pricePerQuote)}) é menor que o mínimo de R$ {formatCurrency(MINIMUM_PRICE_PER_QUOTE)}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <strong>Valor Total:</strong> <span style={{ fontSize: '1.2rem', color: '#27ae60' }}>{formatCurrency(lotteryPool.totalCost)}</span>
                    </div>
                    <div>
                      <strong>Total de Volantes:</strong> <span style={{ fontSize: '1.2rem', color: '#27ae60' }}>{lotteryPool.totalVolantes}</span>
                    </div>
                  </div>
                </div>
                <ShareButton onClick={() => shareOnWhatsApp(lotteryPool.bettingForms)}>
                  Compartilhar no WhatsApp
                </ShareButton>
              </>
            )}
          </JogosCard>
        )}

        {!hasValidInputs && numberOfParticipants !== '' && individualContribution !== '' && (
          <Card>
            <EmptyState>
              Preencha os campos acima para ver os resultados
            </EmptyState>
          </Card>
        )}

        {showTermsModal && (
          <ModalOverlay onClick={() => setShowTermsModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Termos de Uso e Responsabilidade</ModalTitle>
              
              <ModalText>
                Ao usar esta calculadora, você declara que entende e concorda com o seguinte:
              </ModalText>

              <ModalWarningBox>
                <ModalWarningText>
                  <strong>⚠️ Aviso Importante:</strong>
                </ModalWarningText>
                <ModalWarningText>
                  Esta é apenas uma ferramenta de cálculo. Não somos responsáveis pela organização, gestão financeira ou execução do bolão.
                </ModalWarningText>
                <ModalWarningText>
                  <strong>Você é totalmente responsável por:</strong>
                </ModalWarningText>
                <ul style={{ marginLeft: '1.5rem', color: '#856404', fontSize: '0.95rem' }}>
                  <li>Gerenciar o bolão</li>
                  <li>Coletar o dinheiro dos participantes</li>
                  <li>Pagar os volantes na lotérica</li>
                  <li>Distribuir os prêmios (se houver)</li>
                </ul>
              </ModalWarningBox>

              <ModalWarningBox>
                <ModalWarningText>
                  <strong>🔞 Idade Mínima:</strong>
                </ModalWarningText>
                <ModalWarningText>
                  Apostas em loterias no Brasil são permitidas apenas para maiores de 18 anos.
                </ModalWarningText>
              </ModalWarningBox>

              <ModalText>
                Jogue com responsabilidade. Para mais informações sobre jogo responsável, visite:{' '}
                <a
                  href="https://www.caixa.gov.br/jogo-responsavel/Paginas/default.aspx?utm_source=site_caixa&utm_medium=bannercross&utm_campaign=jogo_responsavel"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#667eea', textDecoration: 'underline' }}
                >
                  Jogo Responsável - Caixa Econômica Federal
                </a>
              </ModalText>

              <ModalText>
                Para mais detalhes, consulte a página{' '}
                <Link href="/terms" style={{ color: '#667eea', textDecoration: 'underline' }}>
                  Termos e Serviços
                </Link>.
              </ModalText>

              <ModalButtonGroup>
                <CancelButton onClick={() => setShowTermsModal(false)}>
                  Cancelar
                </CancelButton>
                <AcceptButton
                  onClick={() => {
                    // Save accepted terms version to localStorage
                    if (typeof window !== 'undefined') {
                      localStorage.setItem(TERMS_ACCEPTANCE_KEY, TERMS_VERSION)
                    }
                    setTermsAccepted(true)
                    setShowTermsModal(false)
                  }}
                >
                  Aceito e Entendo
                </AcceptButton>
              </ModalButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}
      </Content>
    </Container>
  )
}

