import { createContext, ReactNode, useReducer, useState } from "react";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
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

interface CyclesState {
    cycles: Cycle[];
    activeCycleId: string | null;

}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => { //dispatch representa a função para fazer algo no reducer, já action é um argumento usado para trabalhar junto ao dispatch; cycleState é o estado que será manipulado;

        switch (action.type) {
            case "ADD_NEW_CYCLE":
                return {
                    // ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id,
                }; //retorno dessa função é o novo valor que esse estado (cycles) vai receber
            case "INTERRUPT_CURRENT_CYCLE":
                return {
                    // ...state,
                    cycles: state.cycles.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
                        if (cycle.id === state.activeCycleId) { //localiza o ciclo em que estamos por meio do id do ciclo atual
                            return { ...cycle, interruptedDate: new Date() } //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
                        } else {
                            return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
                        }
                    }),
                    activeCycleId: null,
                }
            case "MARK_CURRENT_CYCLE_AS_FINISHED":
                return {
                    // ...state,
                    cycles: state.cycles.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
                        if (cycle.id === state.activeCycleId) { //localiza o ciclo em que estamos por meio do id do ciclo atual
                            return { ...cycle, finishedDate: new Date() } //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
                        } else {
                            return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
                        }
                    }),
                    activeCycleId: null,
                }
            default: return state; //caso não entre em nenhum dos if (meio que impossível, mas necessário)

        }

    }, {
        cycles: [],
        activeCycleId: null,
    });

    const { cycles, activeCycleId } = cyclesState;

    // const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const activeCycle = cyclesState.cycles.find(cycle => cycle.id === cyclesState.activeCycleId); //recebendo o objeto Cycle que contém o id do cycle ativo naquele momento (este id é definido na função de handle)

    function markCurrentCycleAsFinished() {
        dispatch({
            type: "MARK_CURRENT_CYCLE_AS_FINISHED",
            payload: {
                activeCycleId,
            },
        });
        // setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
        //     if (cycle.id === activeCycleId) { //localiza o ciclo em que estamos por meio do id do ciclo atual
        //         return { ...cycle, interruptedDate: new Date() } //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
        //     } else {
        //         return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
        //     }
        // }));
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        dispatch({
            type: "ADD_NEW_CYCLE",
            payload: {
                newCycle,
            },
        });
        //setCycles((cycles) => [...cycles, newCycle]); //[...cycles, newCycle] só isso já funciona (coloquei cycles => pra memorizar que a escrita completa é assim) (neste caso tem que ser com arrow function, pois o estado depende do estado anterior (...state), logo tem que usar arrowFunction pra evitar erros de atualizações inconsistentes (closures) )
        //setActiveCycleId(id); //define o id do ciclo que está ativo
        setAmountSecondsPassed(0); //pois acabou de iniciar

        //reset();
    }

    function interruptCurrentCycle() {
        dispatch({
            type: "INTERRUPT_CURRENT_CYCLE",
            payload: {
                activeCycleId,
            },
        });
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
