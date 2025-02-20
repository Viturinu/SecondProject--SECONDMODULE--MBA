import { createContext, ReactNode, useState } from "react";

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

export const CyclesContext = createContext({} as CyclesContextType); //criando o contexto com sua definição (variaveis que estarão ali dentro)

interface CyclesContextProviderProps {
    children: ReactNode; //ReactNode é com html/tsx/jsx válido
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId); //recebendo o objeto Cycle que contém o id do cycle ativo naquele momento (este id é definido na função de handle)

    function markCurrentCycleAsFinished() {
        setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
            if (cycle.id === activeCycleId) { //localiza o ciclo em que estamos por meio do id do ciclo atual
                return { ...cycle, interruptedDate: new Date() } //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
            } else {
                return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
            }
        }));
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

        setCycles((cycles) => [...cycles, newCycle]); //[...cycles, newCycle] só isso já funciona (coloquei cycles => pra memorizar que a escrita completa é assim) (neste caso tem que ser com arrow function, pois o estado depende do estado anterior (...state), logo tem que usar arrowFunction pra evitar erros de atualizações inconsistentes (closures) )
        setActiveCycleId(id); //define o id do ciclo que está ativo
        setAmountSecondsPassed(0);

        //reset();
    }

    function interruptCurrentCycle() {
        setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
            if (cycle.id === activeCycleId) { //localiza o ciclo em que estamos por meio do id do ciclo atual
                return { ...cycle, interruptedDate: new Date() } //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
            } else {
                return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
            }
        }))

        setActiveCycleId(null); //setando o id do ciclo atual para null, pois estamos saindo desse ciclo.
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
