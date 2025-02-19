import { useFormContext } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TextInput } from "./style";;

export function NewCycleForm(){

    const {register} = useFormContext();
    
    // interface NewCycleFormData{ //nem preciso utilizar isso mais, pois o zod consegue extrair a tipagem automaticamente
    //     task: string;
    //     minutesAmount: number;
    // }

    return(
            <FormContainer>
                <label htmlFor="task">Vou trabalhar em</label>
                <TextInput
                    id="task"
                    type="text"
                    placeholder="Dê um nome para o seu projeto"
                    list="task-suggestions"
                    // disabled={!!activeCycle}
                    {...register("task")} //uma função (recebe o nome do input, que estamos setando agora como "task" -  depois retorna metodos que utilizamos para trabalhar com input, por exemplo, onChange, onSubmit, onBlur, onFocus, etc) - daí conseguimos usar lá em cima, recebendo essas funções e executando o que queremos
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
                    // disabled={!!activeCycle}
                    step={5}
                    min={1}
                    max={60}
                    {...register("minutesAmount", {valueAsNumber: true})}
                />                        
                <span>minutos</span>
            </FormContainer>
    )
}

