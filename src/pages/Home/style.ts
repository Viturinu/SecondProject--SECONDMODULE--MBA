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
export const BaseCountDownButton = styled.button`
    width: 100%; //width a gente consegue colocar 100% sem estressa, já o height é melhor usar vh, pois temos que ficar colocando 100% de cima pra baixo em tudo, de acvordo com Diego do RocketSeat
    border: 0;
    padding: 1rem;
    border-radius: 8px; //px mesmo, pois isso não depende de configuração do navegador

    display: flex;
    align-items: center;
    justify-content: center;
    
    color: ${props => props.theme["gray-100"]};

    gap: 0.5rem;
    font-weight: bold;
    cursor: pointer;

    &:disabled{
        opacity: 0.7;
        cursor: not-allowed;
    }

`
export const StartCountdownButton = styled(BaseCountDownButton)`
  background: ${props => props.theme["green-500"]};

  &:not(:disabled):hover{
        background: ${props => props.theme["green-700"]};
    }
`
export const StopCountdownButton = styled(BaseCountDownButton)`
  background: ${props => props.theme["red-500"]};

  &:not(:disabled):hover{
        background: ${props => props.theme["red-700"]};
    }
`