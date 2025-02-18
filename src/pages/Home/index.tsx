import { HandPalm, Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, StopCountdownButton, TextInput } from "./style";
import {useForm} from "react-hook-form"; //aqui é o useForm - hook, para chamarmos as funções de form/inputs (onChange, onBlur, etc) e recuperarmos fora da tag
import {zodResolver} from "@hookform/resolvers/zod"; //aqui é a ponte (resolver) para usar zod no react-hook-for - useForm
import * as zod from "zod"; //vamos criar o esquema de validação com zod
import { useEffect, useState } from "react";
import {differenceInSeconds, interval} from "date-fns";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(1, "O ciclo precisa ser no mínimo de 60 minutos").max(60, "O ciclo precisa ser no máximo de 60 minutos"),
})

// interface NewCycleFormData{ //nem preciso utilizar isso mais, pois o zod consegue extrair a tipagem automaticamente
//     task: string;
//     minutesAmount: number;
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>; //não consigo usar uma variável javascript dentro do meu typescript ( <> ); lembrar sempre disso! Por isso utilizar typeof

interface Cycle{
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

export function Home() {

    //controlled components é você ficar monitorando o tempo todo com states, e refletindo nos forms
    //uncontrolled components é buscar as informações somente quando precisarmos dela (melhor para aplicações complexas -dadas as renderizações pesadas em excesso)
    //é preciso escolher uma das duas; Depende de cada situação e aplicação.

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        }
    });

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId); //recebendo o objeto Cycle que contém o id do cycle ativo naquele momento (este id é definido na função de handle)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; //transformando tempo de minutos em segundos
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60); //math.floor arredonda pra baixo (Math.ceil é pra cima - Math.round é se acima de .5, arredonda pra cima, caso contrário pra baixo)
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, "0"); //adicionando dois numeros pra lidar na interface ('09 segundos'  e não '9 segundos' - exemplo)
    const seconds = String(secondsAmount).padStart(2, "0");

    useEffect(()=>{
        let interval:number;
        if(activeCycle){
             interval = setInterval(() => { //quando em interval pra limpar ela no return, que é chamado assim que useEffect for executado novamente
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate); //ele fica subtraindo a data atual pela setada do inicio do ciclo, num intervalo (não usamos o intervalo direto pois ele pode errar, não é 100% correto, especialmente se mudar de aba)
                
                if(secondsDifference >= totalSeconds){
                    setCycles(state => state.map(cycle => { //percorre todos os ciclos que está salvo no estado e retorna todos os ciclos para atualizar o estando, sendo um deles com sua data de interrupção, quando entra na condicional true 
                        if(cycle.id === activeCycleId){ //localiza o ciclo em que estamos por meio do id do ciclo atual
                            return {...cycle, interruptedDate: new Date()} //quando encontrar, retorna o ciclo e todas as suas propriedades mais uma data de interrupção
                        } else {
                            return cycle; //se não encontrar retorna o ciclo normalmente, sem data de interrupação
                        }
                    }) );

                    setAmountSecondsPassed(totalSeconds);
                    clearInterval(interval);
                } else{
                    setAmountSecondsPassed(secondsDifference); //se não finalizou o ciclo, continua decrementando; 
                }
                
            }, 1000)
        }

        return () => {
            clearInterval(interval);
        }
    }, [activeCycle, totalSeconds, activeCycleId]);

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




    useEffect(() => {
        if(activeCycle){
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes,seconds])

    const task = watch("task"); //controlled component - fica sempre em watch - como se usassemos state - baixa performance, mas bom para aplicações menores e controle total; ou seja, sempre que eu mudar meu input "task" ele está em watch, logo vai renderizar, como se fosse um state mesmo, pois alterei o valor do input
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <NewCycleForm />
                <Countdown/>
                
                { 
                    activeCycle ? (
                        <StopCountdownButton type="button" onClick={handleInterruptCycle}>
                            <HandPalm size={24} />
                            Interromper
                        </StopCountdownButton> 
                    ) : (
                        <StartCountdownButton type="submit" disabled={isSubmitDisabled} >
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )                   
                }
            </form>
        </HomeContainer>
    )
}