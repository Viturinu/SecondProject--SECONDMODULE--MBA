import styled from "styled-components";

export const FormContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: ${props => props.theme["gray-100"]};
    font-size: 1.125rem;
    font-weight: bold;
    flex-wrap: wrap;
`

const BaseInput = styled.input`
    background: transparent;
    height: 2.5rem;
    border: 0;
    border-bottom: 2px solid${props => props.theme["gray-500"]};
    font-weight: bold;
    font-size: inherit;
    padding: 0 0.5rem;
    color: ${props => props.theme["gray-100"]};

    &:focus{
        box-shadow: none; //eu achei que era o outline
        border-color: ${props => props.theme["green-500"]};
    }
    
    &::placeholder{
        color: ${props => props.theme["gray-500"]};
    }
`

export const TextInput = styled(BaseInput)` //uma forma de fazer uma "herança" de componentes estilizados criados aqui, neste caso ele está usando um modelo criado por nós como base
    flex: 1; //atalho para setar três propriedades (flex-grow, flex-shrink e flex-basis)

    &::-webkit-calendar-picker-indicator{
        display: none !important;
    }
`

export const MinutesAmountInput = styled(BaseInput)`
    width: 4rem;
`