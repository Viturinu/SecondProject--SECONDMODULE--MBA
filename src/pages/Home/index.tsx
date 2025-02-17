import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, TextInput } from "./style";
import {useForm} from "react-hook-form"; //aqui é o useForm - hook, para chamarmos as funções de form/inputs (onChange, onBlur, etc) e recuperarmos fora da tag
import {zodResolver} from "@hookform/resolvers/zod"; //aqui é a ponte (resolver) para usar zod no react-hook-for - useForm
import * as zod from "zod"; //vamos criar o esquema de validação com zod

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(5, "O ciclo precisa ser no mínimo de 60 minutos").max(60, "O ciclo precisa ser no máximo de 60 minutos"),
})

export function Home() {

    //controlled components é você ficar monitorando o tempo todo com states, e refletindo nos forms
    //uncontrolled components é buscar as informações somente quando precisarmos dela (melhor para aplicações complexas -dadas as renderizações pesadas em excesso)
    //é preciso escolher uma das duas; Depende de cada situação e aplicação.

    const {register, handleSubmit, watch} = useForm({
        resolver: zodResolver(newCycleFormValidationSchema),
    });

    function handleCreateNewCycle(data:any){

    }

    const task = watch("task"); //controlled component - fica sempre em watch - como se usassemos state - baixa performance, mas bom para aplicações menores e controle total; ou seja, sempre que eu mudar meu input "task" ele está em watch, logo vai renderizar, como se fosse um state mesmo, pois alterei o valor do input
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TextInput
                        id="task"
                        type="text"
                        placeholder="Dê um nome para o seu projeto"
                        list="task-suggestions"
                        {...register("task")} //uma função (recebe o nome do input, que estamos setando agora -  retorna metodos que utilizamos para trabalhar com input, por exemplo, onChange, onSubmit, onBlur, onFocus, etc) - daí conseguimos usar lá em cima, recebendo essas funções e executando o que queremos
                    />

                    <datalist id="task-suggestions"> {/*é uma forma de colocar opções em um input, então sempre que a pessoa clicar pra escrever, já terá um autocomplete desses itens */}
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Projeto 4"/>
                        <option value="Projeto 5"/>
                    </datalist>

                    durante
                    <label htmlFor=""></label>
                    <MinutesAmountInput
                        id="minutesAmount"
                        type="number"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register("minutesAmount", {valueAsNumber: true})}
                    />
                        

                    <span>minutos</span>
                </FormContainer>


                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountDownButton type="submit" disabled={isSubmitDisabled}>
                    <Play size={24} />
                    Começar
                </StartCountDownButton>
            </form>
        </HomeContainer>
    )
}