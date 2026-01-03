'use client'

import { useState, useMemo } from 'react'
import styled from 'styled-components'
import {
  MEGA_SENA_PRICES,
  BettingFormCalculationResult,
  createBettingFormFromResult,
} from '@/types/calculator'
import { BettingForm, LotteryPool, MAX_GAMES_PER_BETTING_FORM, MINIMUM_PRICE_PER_QUOTE } from '@/types/domain'

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
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
`

const TableCell = styled.td`
  padding: 1rem;
  color: #555;
  font-size: 0.95rem;
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
`

const RemoveButton = styled(Button)`
  background: #e74c3c;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;

  &:hover {
    background: #c0392b;
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
  const [totalAmount, setTotalAmount] = useState<string>('')
  const [numberOfQuotes, setNumberOfQuotes] = useState<string>('')
  const [selectedBettingForms, setSelectedBettingForms] = useState<BettingForm[]>([])

  // Parse the formatted currency input to number
  const totalAmountNum = parseCurrencyInput(totalAmount)
  const numberOfQuotesNum = parseInt(numberOfQuotes) || 0

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setTotalAmount(formatted)
  }

  const errors = {
    totalAmount: totalAmountNum <= 0 && totalAmount !== '',
    numberOfQuotes: numberOfQuotesNum < 1 && numberOfQuotes !== '',
  }

  const hasErrors = errors.totalAmount || errors.numberOfQuotes
  const hasValidInputs = totalAmountNum > 0 && numberOfQuotesNum >= 1

  const calculationResults = useMemo(() => {
    if (!hasValidInputs) return []
    const allResults = calculateBettingFormResults(totalAmountNum, numberOfQuotesNum)
    // Filter to only show possible betting forms (bettingFormsPossible > 0)
    // Sort by bettingFormsPossible ascending
    return allResults
      .filter((result) => result.bettingFormsPossible > 0)
      .sort((a, b) => a.bettingFormsPossible - b.bettingFormsPossible)
  }, [totalAmountNum, numberOfQuotesNum, hasValidInputs])

  // Find best value (most betting forms possible)
  const bestValue = calculationResults.length > 0 
    ? calculationResults.reduce((best, current) => 
        current.bettingFormsPossible > best.bettingFormsPossible ? current : best
      )
    : null

  // Create Lottery Pool from selected betting forms
  const lotteryPool = useMemo((): LotteryPool | null => {
    if (selectedBettingForms.length === 0) return null

    const totalCost = selectedBettingForms.reduce((sum, bf) => sum + bf.totalCost, 0)
    const totalGames = selectedBettingForms.reduce((sum, bf) => sum + bf.games.length, 0)
    
    // Check if all betting forms have the same number of quotes
    const firstQuotes = selectedBettingForms[0]?.quotes
    const allSameQuotes = selectedBettingForms.every((bf) => bf.quotes === firstQuotes)

    return {
      bettingForms: selectedBettingForms,
      totalCost,
      totalGames,
      totalQuotes: allSameQuotes ? firstQuotes : undefined,
    }
  }, [selectedBettingForms])

  const addBettingForm = (result: BettingFormCalculationResult) => {
    // Check if betting form with this dezenas is already added
    if (!selectedBettingForms.find((bf) => bf.games[0]?.dezenas === result.dezenas)) {
      const bettingForm = createBettingFormFromResult(result, numberOfQuotesNum)
      setSelectedBettingForms([...selectedBettingForms, bettingForm])
    }
  }

  const removeBettingForm = (dezenas: number) => {
    setSelectedBettingForms(selectedBettingForms.filter(
      (bf) => bf.games[0]?.dezenas !== dezenas
    ))
  }

  return (
    <Container>
      <Content>
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
              <Label htmlFor="totalAmount">Valor Total (R$)</Label>
              <Input
                id="totalAmount"
                type="text"
                placeholder="Ex: R$ 1.000"
                value={totalAmount}
                onChange={handleTotalAmountChange}
              />
              {errors.totalAmount && (
                <ErrorMessage>O valor deve ser maior que zero</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="numberOfQuotes">Número de Cotas</Label>
              <Input
                id="numberOfQuotes"
                type="number"
                min="1"
                placeholder="Ex: 10"
                value={numberOfQuotes}
                onChange={(e) => setNumberOfQuotes(e.target.value)}
              />
              {errors.numberOfQuotes && (
                <ErrorMessage>O número de cotas deve ser pelo menos 1</ErrorMessage>
              )}
            </FormGroup>
          </FormGrid>
        </Card>

        {hasValidInputs && lotteryPool && (
          <JogosCard>
            <ResultsTitle>Bolão</ResultsTitle>
            <JogosList>
              {lotteryPool.bettingForms.map((bettingForm, index) => {
                const dezenas = bettingForm.games[0]?.dezenas || 0
                const numBettingForms = Math.floor(bettingForm.games.length / MAX_GAMES_PER_BETTING_FORM)
                return (
                  <JogoItem key={`${dezenas}-${index}`}>
                    <JogoInfo>
                      <JogoTitle>
                        Volante {index + 1}: {dezenas} dezenas - {numBettingForms} Volante(s) ({bettingForm.games.length} jogos)
                        {!bettingForm.isValid && (
                          <span style={{ color: '#e74c3c', marginLeft: '0.5rem' }}>
                            ⚠️ Inválido (preço por cota &lt; R$ {formatCurrency(MINIMUM_PRICE_PER_QUOTE)})
                          </span>
                        )}
                      </JogoTitle>
                      <JogoDetails>
                        Custo total: {formatCurrency(bettingForm.totalCost)} | 
                        Cotas: {bettingForm.quotes} | 
                        Preço por cota: {formatCurrency(bettingForm.pricePerQuote)}
                        {bettingForm.isValid && (
                          <span style={{ color: '#27ae60', marginLeft: '0.5rem' }}>✓ Válido</span>
                        )}
                      </JogoDetails>
                    </JogoInfo>
                    <RemoveButton onClick={() => removeBettingForm(dezenas)}>
                      Remover
                    </RemoveButton>
                  </JogoItem>
                )
              })}
            </JogosList>
          </JogosCard>
        )}

        {hasValidInputs && calculationResults.length > 0 && (
          <ResultsCard>
            <ResultsTitle>Resultados por Tipo de Jogo</ResultsTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Dezenas</TableHeaderCell>
                  <TableHeaderCell>Preço por Jogo</TableHeaderCell>
                  <TableHeaderCell>Volantes</TableHeaderCell>
                  <TableHeaderCell>Jogos</TableHeaderCell>
                  <TableHeaderCell>Custo Total</TableHeaderCell>
                  <TableHeaderCell>Preço por Cota</TableHeaderCell>
                  <TableHeaderCell>Ação</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {calculationResults.map((result) => {
                  const isBestValue = bestValue?.dezenas === result.dezenas
                  const isAlreadyAdded = selectedBettingForms.some(
                    (bf) => bf.games[0]?.dezenas === result.dezenas
                  )
                  return (
                    <TableRow key={result.dezenas}>
                      <TableCell>
                        {result.dezenas}
                      </TableCell>
                      <TableCell>
                        <Currency>{formatCurrency(result.pricePerGame)}</Currency>
                      </TableCell>
                      <HighlightCell>
                        {result.bettingFormsPossible}
                      </HighlightCell>
                      <TableCell>
                        {result.actualGamesUsed}
                      </TableCell>
                      <TableCell>
                        <Currency>{formatCurrency(result.totalCost)}</Currency>
                      </TableCell>
                      <TableCell>
                        <Currency>{formatCurrency(result.pricePerQuote)}</Currency>
                      </TableCell>
                      <ActionCell>
                        <Button
                          onClick={() => addBettingForm(result)}
                          disabled={isAlreadyAdded || !result.isValid}
                        >
                          {isAlreadyAdded ? 'Adicionado' : result.isValid ? 'Adicionar' : 'Inválido'}
                        </Button>
                      </ActionCell>
                    </TableRow>
                  )
                })}
              </tbody>
            </Table>
          </ResultsCard>
        )}

        {!hasValidInputs && totalAmount !== '' && numberOfQuotes !== '' && (
          <Card>
            <EmptyState>
              Preencha os campos acima para ver os resultados
            </EmptyState>
          </Card>
        )}
      </Content>
    </Container>
  )
}

