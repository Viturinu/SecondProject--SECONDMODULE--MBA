import styled from "styled-components";

export const HistoryContainer = styled.main`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 3.5rem;

    & h1{
        font-size: 1.5rem;
        color:${props => props.theme["gray-400"]};
    }

`

export const HistoryList = styled.div` //essa div vai envelopar toda a tabela, pois quando tivermos num mobile (responsividade), para fazer scroll na table não é possivel, mas na div sim. Essa é a razão apresentada pelo Diego.
    /* flex: 1; */
    height: 60vh;
    overflow: auto;
    margin-top: 2rem;

    & table{
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;

        & th{
            background-color: ${props => props.theme["gray-600"]};
            padding: 1rem;
            text-align: left;
            color: ${props => props.theme["gray-100"]};
            font-size: 0.875rem;
            line-height: 1.6;

            &:first-child{
                border-top-left-radius: 8px;
                padding-left: 1.5rem;
            }
            &:last-child{
                border-top-right-radius: 8px;
                padding-right: 1.5rem;
            }
        }

        & td{
            background-color: ${props => props.theme["gray-700"]};
            border-top: 4px solid ${props => props.theme["gray-800"]};
            padding: 1rem;
            font-size: 0%.875rem;
            line-height: 1.6;
        
            &:first-child{
                padding-left: 1.5rem;
                width: 50%;
            }
            &:last-child{
                padding-right: 1.5rem;
            }
        }
    }
`

const STATUS_COLORS = {
    yellow: "yellow-500",
    green: "green-500",
    red: "red-500",
} as const

interface StatusProps {
    statusColor: keyof typeof STATUS_COLORS //uma opção: "yellow" | "red" | "green"; mas mais interessante é dizer, como feito ali, que o statusColor pode ser as chaves do nosso tipo  STATUS_COLOR, que no caso é um objeto com suas chaves, como ali acima. Isso é muito melhor pois tudo fica flexicel, se adicionarmos mais chaves ali no bjeto, automaticamente já estará constando aqui (lembrando que tem que estar no tema geral, caso contrario, vai dar erro) (não pode ser keyof STATUS_COLOR direto porque typescript não consegue ler objetos javascript, ele consegue ler a tipagem do objeto javascript)
}

export const Status = styled.span<StatusProps>`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before{ //quando colocamos um item ::before ou ::after, ele identifica isso como um elemento diferente do corpo inserido na tag verdadeira, logo o gap faz sentido por isso
        content: "";
        background-color: ${props => props.theme[STATUS_COLORS[props.statusColor]]};
        height: .5rem;
        width: .5rem;
        border-radius: 50%;
    }
    
`
