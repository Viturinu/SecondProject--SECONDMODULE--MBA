import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./style";
import {FormProvider, useForm} from "react-hook-form"; //aqui é o useForm - hook, para chamarmos as funções de form/inputs (onChange, onBlur, etc) e recuperarmos fora da tag
import {zodResolver} from "@hookform/resolvers/zod"; //aqui é a ponte (resolver) para usar zod no react-hook-for - useForm
import { createContext, useState } from "react";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import * as zod from "zod";

interface Cycle{
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
}

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(1, "O ciclo precisa ser no mínimo de 60 minutos").max(60, "O ciclo precisa ser no máximo de 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>; //não consigo usar uma variável javascript dentro do meu typescript ( <> ); lembrar sempre disso! Por isso utilizar typeof

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {

    //controlled components é você ficar monitorando o tempo todo com states, e refletindo nos forms
    //uncontrolled components é buscar as informações somente quando precisarmos dela (melhor para aplicações complexas -dadas as renderizações pesadas em excesso)
    //é preciso escolher uma das duas; Depende de cada situação e aplicação.

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId); //recebendo o objeto Cycle que contém o id do cycle ativo naquele momento (este id é definido na função de handle)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        }
    });

    const { handleSubmit, watch, reset} = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData){
        const id = String(new Date().getTime());

        const newCycle:Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((cycles) => [...cycles, newCycle]); //[...cycles, newCycle] só isso já funciona (coloquei cycles => pra memorizar que a escrita completa é assim) (neste caso tem que ser com arrow function, pois o estado depende do estado anterior (...state), logo tem que usar arrowFunction pra evitar erros de atualizações inconsistentes (closures) )
        setActiveCycleId(id); //define o id do ciclo que está ativo
        setAmountSecondsPassed(0);

        reset();
    }

    function handleInterruptCycle(){
        setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
            if(cycle.id === activeCycleId){ //localiza o ciclo em que estamos por meio do id do ciclo atual
                return {...cycle, interruptedDate: new Date()} //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
            } else {
                return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
            }
        }) )

        setActiveCycleId(null); //setando o id do ciclo atual para null, pois estamos saindo desse ciclo.
        document.title = document.title = "Ignite Timer"

    }

    function markCurrentCycleAsFinished(){
        setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
            if(cycle.id === activeCycleId){ //localiza o ciclo em que estamos por meio do id do ciclo atual
                return {...cycle, interruptedDate: new Date()} //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
            } else {
                return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
            }
        }) );
    }

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds);
    }

    const task = watch("task"); //controlled component - fica sempre em watch - como se usassemos state - baixa performance, mas bom para aplicações menores e controle total; ou seja, sempre que eu mudar meu input "task" ele está em watch, logo vai renderizar, como se fosse um state mesmo, pois alterei o valor do input
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <CyclesContext.Provider value={{activeCycle, activeCycleId, amountSecondsPassed, markCurrentCycleAsFinished, setSecondsPassed}}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm /> 
                    </FormProvider>
                    <Countdown />
                </CyclesContext.Provider>

                {  
                    activeCycle ? (
                        <StopCountdownButton type="button" onClick={handleInterruptCycle}>
                            <HandPalm size={24} />
                            Interromper
                        </StopCountdownButton> 
                    ) : (
                        <StartCountdownButton type="submit"  disabled={isSubmitDisabled} >
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )                   
                }
            </form>
            
        </HomeContainer>
    )
}