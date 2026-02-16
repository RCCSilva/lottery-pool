'use client'

import styled from 'styled-components'

/* Theme: warm cream background, teal accent */
const colors = {
  primary: '#0d9488',
  primaryHover: '#0f766e',
}

export const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  background: #ebe6df;
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: #999;
  }
`

export const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`

export const ResultsCard = styled(Card)`
  margin-top: 2rem;
`

export const ResultsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`

export const CollapsibleTitle = styled(ResultsTitle)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  margin-bottom: 0;
  padding: 1rem 0;
  margin-top: 0;

  &:hover {
    color: ${colors.primary};
  }
`

export const ExpandIcon = styled.span<{ $isExpanded: boolean }>`
  font-size: 1.2rem;
  transition: transform 0.2s;
  transform: ${(props) => (props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

export const TableHeader = styled.thead`
  background: #f8f9fa;
`

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }

  &:hover {
    background: #e9ecef;
  }
`

export const TableHeaderCell = styled.th`
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

export const TableCell = styled.td`
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

export const HighlightCell = styled(TableCell)`
  font-weight: 600;
  color: ${colors.primary};
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #999;
`

export const Currency = styled.span`
  font-weight: 500;
`

export const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${colors.primaryHover};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const AddButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  background: ${colors.primary};
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
    background: ${colors.primaryHover};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`

export const RemoveButton = styled(Button)`
  background: #e74c3c;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;

  &:hover {
    background: #c0392b;
  }
`

export const QuantityButton = styled.button`
  width: 2rem;
  height: 2rem;
  background: ${colors.primary};
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
    background: ${colors.primaryHover};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const QuantityDisplay = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  min-width: 2rem;
  text-align: center;
`

export const ShareButton = styled(Button)`
  background: #25d366;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background: #20ba5a;
  }
`

export const CalculateButton = styled(Button)`
  background: ${colors.primary};
  padding: 1rem 2rem;
  font-size: 1.1rem;
  width: 100%;
  margin-top: 1rem;
  display: block !important; /* Override the mobile hide rule from Button */

  &:hover {
    background: ${colors.primaryHover};
  }

  @media (max-width: 768px) {
    display: block !important; /* Ensure it's visible on mobile */
  }
`

export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`

export const ModalText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`

export const ModalWarningBox = styled.div`
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`

export const ModalWarningText = styled.p`
  font-size: 0.95rem;
  color: #856404;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`

export const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

export const AcceptButton = styled(Button)`
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

export const CancelButton = styled(Button)`
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

export const JogosCard = styled(Card)`
  margin-top: 2rem;
`

export const JogosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const JogoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
`

export const JogoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const JogoTitle = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`

export const JogoDetails = styled.div`
  font-size: 0.85rem;
  color: #666;
`

export const ActionCell = styled(TableCell)`
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`

export const MobileActionCell = styled(TableCell)`
  display: none;
  text-align: center;
  padding: 0.5rem;
  vertical-align: middle;
  horizontal-align: center;

  @media (max-width: 768px) {
    display: table-cell;
  }
`
