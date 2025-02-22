import { ActionTypes } from "./actions";

export interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesState {
    cycles: Cycle[];
    activeCycleId: string | null;

}

export function cyclesReducer(state: CyclesState, action: any) { //dispatch representa a função para fazer algo no reducer, já action é um argumento usado para trabalhar junto ao dispatch; cycleState é o estado que será manipulado;

    switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE: { //era String normal, daí criamos um enum pra ficar mais legível e manutenivel
            return { //esse return sempre retorna o estado/valor que será alocado lá no const [cyclesState, dispatch] = useReducer(cyclesReducer , ...
                // ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycle.id,
            }; //retorno dessa função é o novo valor que esse estado (cycles) vai receber
            // return produce(state, (draft) => { //produce me permite trabalhar com os dados sem preocupar com imutabilidade do React, como fazemos quando usamos map, pois percorremos tudo para criar um novo array e definir a variável com este novo array
            //     draft.cycles.push(action.payload.newCycle); //consegue ver? push não respeita a imutabilidade, mas aqui podemos usar por conta da biblioteca immer e seu método produce()
            //     draft.activeCycleId = action.payload.activeCycleId;
            // });
        }
        case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
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

            // const currentCycleIndex = state.cycles.findIndex(cycle => {
            //     return cycle.id === state.activeCycleId; //percorrendo array pra achar o objeto que contem o activeCycleId (que também é salvo como uma outra variável)
            // });

            // if(currentCycleIndex < 0){
            //     return state;
            // }

            // return produce(state, (draft) => {
            //     draft.activeCycleId = null;
            //     draft.cycles[currentCycleIndex].interruptedDate = new Date();
            // })
        }

        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
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
            // const currentCycleIndex = state.cycles.findIndex(cycle => {
            //     return cycle.id === state.activeCycleId; //percorrendo array pra achar o objeto que contem o activeCycleId (que também é salvo como uma outra variável)
            // });

            // if(currentCycleIndex < 0){
            //     return state;
            // }

            // return produce(state, (draft) => {
            //     draft.activeCycleId = null;
            //     draft.cycles[currentCycleIndex].finishedDate = new Date();
            // })
        }

        default: return state; //caso não entre em nenhum dos if (meio que impossível, mas necessário)
    }
}