import styled from "styled-components";

export const HomeContainer = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //tipo o SASS e outros pre processadores - podemos criar cascatas dentro do styled component, como abaixo
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;

    }

`
export const StartCountDownButton = styled.button`
    width: 100%; //width a gente consegue colocar 100% sem estressa, já o height é melhor usar vh, pois temos que ficar colocando 100% de cima pra baixo em tudo, de acvordo com Diego do RocketSeat
    border: 0;
    padding: 1rem;
    border-radius: 8px; //px mesmo, pois isso não depende de configuração do navegador

    display: flex;
    align-items: center;
    justify-content: center;
    
    gap: 0.5rem;
    font-weight: bold;
    cursor: pointer;

    background: ${props => props.theme["green-500"]};
    color: ${props => props.theme["gray-100"]};

    &:disabled{
        opacity: 0.7;
        cursor: not-allowed;
    }

    &:not(:disabled):hover{
        background: ${props => props.theme["green-700"]};
    }

`

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

export const CountdownContainer = styled.div`
    font-family: "Roboto Mono", monospace;
    font-size: 10rem;
    line-height: 8rem;
    color: ${props => props.theme["gray-00"]};

    display: flex;
    gap: 1rem;

    span{
        background:  ${props => props.theme["gray-700"]};
        padding: 2rem 1rem;
        border-radius: 8px;
    }
`
export const Separator = styled.div`
    padding: 2rem 0;
    color: ${props => props.theme["green-500"]};

    width: 4rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    /* border: 2px solid black; */
`