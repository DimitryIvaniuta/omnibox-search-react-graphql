import React from "react";
type Status = "new" | "inProgress" | "running" | "done" | "error";
type Task = {
    id: string;
    name: string;
    description: string;
    status: Status;
}
type Tasks = {
    tasks: Task[];
}
type TasksByStatus = Record<Status, Task[]>;

const KanbanBoard = ({tasks}: Tasks) => {
    const byStatus = tasks.reduce<TasksByStatus>(
        (acc, task) => {
            acc[task.status].push(task);
            return acc;
        },
        {new: [], inProgress: [], running: [], done: [], error: [],}
    );
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {
                (
                    Object.keys(byStatus) as Array<keyof TasksByStatus>
                ).map((status) => (
                    <section key={status} style={{display: "flex", flexDirection: "column"}}>
                        <h3>{status}</h3>
                        <ul>
                            {byStatus[status].map(
                                (task) => (
                                    <li key={task.id}>{task.name}</li>
                                )
                            )}
                        </ul>

                    </section>
                ))
            }
        </div>
    );

};

export default KanbanBoard;