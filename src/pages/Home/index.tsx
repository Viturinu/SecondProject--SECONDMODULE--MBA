import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./style";
import { FormProvider, useForm } from "react-hook-form"; //aqui é o useForm - hook, para chamarmos as funções de form/inputs (onChange, onBlur, etc) e recuperarmos fora da tag
import { zodResolver } from "@hookform/resolvers/zod"; //aqui é a ponte (resolver) para usar zod no react-hook-for - useForm
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import * as zod from "zod";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CycleContext";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(1, "O ciclo precisa ser no mínimo de 60 minutos").max(60, "O ciclo precisa ser no máximo de 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>; //não consigo usar uma variável javascript dentro do meu typescript ( <> ); lembrar sempre disso! Por isso utilizar typeof


export function Home() {

    //controlled components é você ficar monitorando o tempo todo com states, e refletindo nos forms
    //uncontrolled components é buscar as informações somente quando precisarmos dela (melhor para aplicações complexas -dadas as renderizações pesadas em excesso)
    //é preciso escolher uma das duas; Depende de cada situação e aplicação.

    const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) { //apenas para convenção, ou seja, sempre que for evento chamando funlção, criar uma handle
        createNewCycle(data);
        reset();
    }

    const task = watch("task"); //controlled component - fica sempre em watch - como se usassemos state - baixa performance, mas bom para aplicações menores e controle total; ou seja, sempre que eu mudar meu input "task" ele está em watch, logo vai renderizar, como se fosse um state mesmo, pois alterei o valor do input
    const isSubmitDisabled = !task; //pra gente monitorar o estado do input task e se não tiver nada, desabilitar o botão de start

    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {
                    activeCycle ? (
                        <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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