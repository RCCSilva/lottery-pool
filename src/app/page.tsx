'use client'

import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #ebe6df;
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: #0d9488;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(13, 148, 136, 0.4);
    background: #0f766e;
  }
`

export default function Home() {
  return (
    <Container>
      <Card>
        <Title>Bolão da Mega-Sena</Title>
        <Description>
          Calcule quantos bilhetes podem ser comprados para seu Bolão baseado no valor total e número de cotas.
        </Description>
        <Button href="/calculator">
          Usar Calculadora
        </Button>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/terms" style={{ color: '#0d9488', textDecoration: 'none', fontSize: '0.9rem' }}>
            Termos e Serviços
          </Link>
        </div>
      </Card>
    </Container>
  )
}

