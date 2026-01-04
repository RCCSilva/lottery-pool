'use client'

import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #555;
  margin-top: 2rem;
  margin-bottom: 1rem;
`

const Paragraph = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`

const WarningBox = styled.div`
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
`

const WarningTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #856404;
  margin-bottom: 0.75rem;
`

const WarningText = styled.p`
  font-size: 1rem;
  color: #856404;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`

const LinkStyled = styled.a`
  color: #667eea;
  text-decoration: underline;
  font-weight: 600;

  &:hover {
    color: #764ba2;
  }
`

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }
`

export default function TermsPage() {
  return (
    <Container>
      <Content>
        <Card>
          <Title>Termos e Serviços</Title>

          <Paragraph>
            Esta é uma calculadora de Bolão da Mega-Sena desenvolvida para ajudar você a organizar e calcular os custos do seu bolão.
          </Paragraph>

          <WarningBox>
            <WarningTitle>⚠️ Aviso Importante</WarningTitle>
            <WarningText>
              <strong>Este site é apenas uma ferramenta de cálculo.</strong> Não somos responsáveis pela organização, gestão financeira ou execução do bolão.
            </WarningText>
            <WarningText>
              O usuário é totalmente responsável por:
            </WarningText>
            <ul style={{ marginLeft: '1.5rem', color: '#856404' }}>
              <li>Gerenciar o bolão</li>
              <li>Coletar o dinheiro dos participantes</li>
              <li>Pagar os volantes na lotérica</li>
              <li>Distribuir os prêmios (se houver)</li>
            </ul>
          </WarningBox>

          <Subtitle>Jogo Responsável</Subtitle>

          <WarningBox>
            <WarningTitle>🔞 Idade Mínima</WarningTitle>
            <WarningText>
              Apostas em loterias no Brasil são permitidas apenas para maiores de 18 anos.
            </WarningText>
          </WarningBox>

          <Paragraph>
            Jogue com responsabilidade. Se você ou alguém que você conhece tem problemas com jogos, procure ajuda.
          </Paragraph>

          <Paragraph>
            Para mais informações sobre jogo responsável, visite o site oficial da Caixa Econômica Federal:
          </Paragraph>

          <Paragraph style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <LinkStyled
              href="https://www.caixa.gov.br/jogo-responsavel/Paginas/default.aspx?utm_source=site_caixa&utm_medium=bannercross&utm_campaign=jogo_responsavel"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jogo Responsável - Caixa Econômica Federal
            </LinkStyled>
          </Paragraph>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <BackButton href="/">
              Voltar para a Calculadora
            </BackButton>
          </div>
        </Card>
      </Content>
    </Container>
  )
}

