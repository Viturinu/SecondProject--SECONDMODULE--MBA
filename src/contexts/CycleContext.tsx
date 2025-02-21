import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType); //criando o contexto com sua definição (variaveis que estarão ali dentro do provider)

interface CyclesContextProviderProps {
    children: ReactNode; //ReactNode é com html/tsx/jsx válido
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(cyclesReducer , {
        cycles: [],
        activeCycleId: null,
    }, (initialState) => { //função apra inicializar esse estado/reducer (o parâmetro anterior também faz isso por meio de um objeto; já nessa aqui podemos colocar alguma lógica)
        const storedStateAsJSON = localStorage.getItem("@ignite-timer:cycles-state");

        if(storedStateAsJSON){
            return JSON.parse(storedStateAsJSON);
        }

        return initialState

            // cycles: [],
            // activeCycleId: null,  
    });

    const { cycles, activeCycleId } = cyclesState;

    // const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const activeCycle = cyclesState.cycles.find(cycle => cycle.id === cyclesState.activeCycleId); //recebendo o objeto Cycle que contém o id do cycle ativo naquele momento (este id é definido na função de handle)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => { //colocar uma função no useState é bom para trabalhar um valor de forma dinâmica, em uma função, assim já setamos o valor com a função desejada, ao invés de definir zero, e um useEffect, por exemplo, executar alguma logica pra atualizar o valor (é possível também, mas em alguns casos, como agora no pomnodoro, quando iniciamos a contagem ele fica zerando pra depois atuaçizar; logo, é melhor que já se faça a logica dentro de uma função dentro da inicialização do useState())

        if(activeCycle){ //se já existir um activeCycle, então
            return  differenceInSeconds(new Date(), new Date(activeCycle.startDate)); //ele fica subtraindo a data atual pela setada do inicio do ciclo, num intervalo (não usamos o intervalo direto pois ele pode errar, não é 100% correto, especialmente se mudar de aba)
        }
        
        return 0;  
    });


    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
        // setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
        //     if (cycle.id === activeCycleId) { //localiza o ciclo em que estamos por meio do id do ciclo atual
        //         return { ...cycle, interruptedDate: new Date() } //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
        //     } else {
        //         return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
        //     }
        // }));
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        dispatch(addNewCycleAction(newCycle));
        //setCycles((cycles) => [...cycles, newCycle]); //[...cycles, newCycle] só isso já funciona (coloquei cycles => pra memorizar que a escrita completa é assim) (neste caso tem que ser com arrow function, pois o estado depende do estado anterior (...state), logo tem que usar arrowFunction pra evitar erros de atualizações inconsistentes (closures) )
        //setActiveCycleId(id); //define o id do ciclo que está ativo
        setAmountSecondsPassed(0); //pois acabou de iniciar

        //reset();
    }

    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction());
        // setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
        //     if (cycle.id === activeCycleId) { //localiza o ciclo em que estamos por meio do id do ciclo atual
        //         return { ...cycle, interruptedDate: new Date() } //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção, pois estamos interrompendo este ciclo
        //     } else {
        //         return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
        //     }
        // }))

        // setActiveCycleId(null); //setando o id do ciclo atual para null, pois estamos saindo desse ciclo.
        document.title = document.title = "Ignite Timer" //voltando titulo da pagina pro padrão
    }

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState); //tem que ser texto, é a forma que o localStorage grava as informações
        localStorage.setItem("@ignite-timer:cycles-state", stateJSON ); //colocar sempre nome da aplicação:alguma coisa, pois se for muito generico e tiver trabalahdno em outros projetos, pode sobrescrever esses valores
    }, [cyclesState])
    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                amountSecondsPassed,
                markCurrentCycleAsFinished,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider >
    )
}
