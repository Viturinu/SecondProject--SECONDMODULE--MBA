import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./style";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "..";

export function Countdown(){

    const {activeCycle, activeCycleId, amountSecondsPassed, markCurrentCycleAsFinished, setSecondsPassed} = useContext(CyclesContext);

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
                    markCurrentCycleAsFinished();
                    setSecondsPassed(totalSeconds);
                    clearInterval(interval);
                } else{
                    setSecondsPassed(secondsDifference); //se não finalizou o ciclo, continua decrementando; 
                }
                
            }, 1000)
        }

        return () => {
            clearInterval(interval);
        }
    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished]);

    useEffect(() => {
        if(activeCycle){
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes,seconds]);

    return(
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    ) 
}    
    