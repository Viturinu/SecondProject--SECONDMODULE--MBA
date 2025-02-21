import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./style";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CyclesContext } from "../../contexts/CycleContext";

export function History() {

    const { cycles } = useContext(CyclesContext);
    return (
        <HistoryContainer>
            <h1>Meu histórico</h1>
            {/* <pre>
                {JSON.stringify(cycles, null, 2)}
            </pre> */}
            <HistoryList>
                <table>
                    <thead>
                        <th>Tarefa</th>
                        <th>Duração</th>
                        <th>Início</th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                        {cycles.map(cycle => {
                            return (
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minutesAmount} minutos</td>
                                    <td>{formatDistanceToNow(new Date(cycle.startDate),{
                                        addSuffix: true,
                                        locale: ptBR,
                                    }) /*cycle.startDate.toISOString()*/}</td>
                                    <td>
                                        {cycle.finishedDate && (
                                            <Status statusColor="green">Concluido</Status>
                                        )}
                                        {cycle.interruptedDate && (
                                            <Status statusColor="red">Interrompido</Status>
                                        )}
                                        {!cycle.finishedDate && !cycle.interruptedDate && (
                                            <Status statusColor="yellow">Em andamento</Status>
                                        )}

                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}