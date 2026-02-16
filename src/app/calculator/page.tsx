'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Game, BettingForm, MAX_GAMES_PER_BETTING_FORM, MINIMUM_PRICE_PER_QUOTE } from '@/types/domain'
import { TERMS_VERSION, TERMS_ACCEPTANCE_KEY } from '@/constants/terms'
import {
  formatCurrency,
  formatCurrencyInput,
  parseCurrencyInput,
  processCalculationResults,
  findOptimalResult,
  createOptimalGames,
  getOptimalResultKey,
  createLotteryPoolFromGames,
  groupGamesByDezenas,
  buildWhatsAppShareMessage,
} from '@/lib/calculator'
import {
  Container,
  Content,
  Card,
  Title,
  Subtitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  ResultsCard,
  ResultsTitle,
  CollapsibleTitle,
  ExpandIcon,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  EmptyState,
  Currency,
  Button,
  AddButton,
  QuantityButton,
  QuantityControls,
  QuantityDisplay,
  ShareButton,
  CalculateButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalText,
  ModalWarningBox,
  ModalWarningText,
  ModalButtonGroup,
  AcceptButton,
  CancelButton,
  JogosCard,
  JogosList,
  JogoItem,
  JogoInfo,
  JogoTitle,
  JogoDetails,
  ActionCell,
  MobileActionCell,
} from './page.styles'

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
    return processCalculationResults(totalAmountNum, numberOfQuotesNum)
  }, [totalAmountNum, numberOfQuotesNum, hasValidInputs])

  const optimalResult = findOptimalResult(calculationResults.withinBudget)

  // Auto-add optimal games when inputs change
  useEffect(() => {
    if (hasValidInputs && optimalResult && optimalResult.isValid) {
      const optimalKey = getOptimalResultKey(optimalResult, numberOfQuotesNum)

      if (optimalKey !== lastOptimalKey) {
        setSelectedGames(createOptimalGames(optimalResult))
        setLastOptimalKey(optimalKey)
      }
    } else if (!hasValidInputs) {
      setSelectedGames([])
      setLastOptimalKey('')
    }
  }, [optimalResult, hasValidInputs, numberOfQuotesNum, lastOptimalKey])

  const lotteryPool = useMemo(
    () => createLotteryPoolFromGames(selectedGames, numberOfQuotesNum),
    [selectedGames, numberOfQuotesNum]
  )

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

  const groupedGames = useMemo(
    () => groupGamesByDezenas(selectedGames),
    [selectedGames]
  )

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

    const totalCost = bettingForms.reduce((sum, bf) => sum + bf.totalCost, 0)
    const message = buildWhatsAppShareMessage(
      bettingForms,
      numberOfParticipantsNum,
      totalCost
    )
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Container>
      <Content>
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <Link href="/terms" style={{ color: '#0d9488', textDecoration: 'none', fontSize: '0.9rem' }}>
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
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#ecfdf5', borderRadius: '8px', textAlign: 'center' }}>
              <strong>Orçamento Total:</strong> <span style={{ fontSize: '1.2rem', color: '#0d9488' }}>{formatCurrency(totalAmountNum)}</span>
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
                  <ExpandIcon $isExpanded={isOverBudgetExpanded}>▼</ExpandIcon>
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
                                <span style={{ color: '#0d9488', marginLeft: '0.5rem' }}>✓ Válido</span>
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
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ecfdf5', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <strong>Valor Total:</strong> <span style={{ fontSize: '1.2rem', color: '#0d9488' }}>{formatCurrency(lotteryPool.totalCost)}</span>
                    </div>
                    <div>
                      <strong>Total de Volantes:</strong> <span style={{ fontSize: '1.2rem', color: '#0d9488' }}>{lotteryPool.totalVolantes}</span>
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
                  style={{ color: '#0d9488', textDecoration: 'underline' }}
                >
                  Jogo Responsável - Caixa Econômica Federal
                </a>
              </ModalText>

              <ModalText>
                Para mais detalhes, consulte a página{' '}
                <Link href="/terms" style={{ color: '#0d9488', textDecoration: 'underline' }}>
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

