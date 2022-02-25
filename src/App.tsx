import React, { useState, useCallback } from "react";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import update from "immutability-helper";

import TaskCard from "./components/TaskCard";
import BoxTarget from "./components/BoxTarget";
import { ITask } from "./components/interfaces";

export const CardContex = React.createContext({
  markAsDone: (id: string, type: string, index: number, itemType: string) => {},
  moveTask: (dragIndex: number, hoverIndex: number,  itemType: string) => {},
});

const CenteredDiv = styled.div`
  width: 100vw;
  /* height: 100vw; */
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: white;
`;
const Box = styled.div`
  text-align: center;
  /* width: 20rem; */
  /* height: 50rem; */
  margin: 1rem;
  background-color: #63d1c6;
  display: flex;
  /* flex-direction: column; */
  /* align-content: center; */
  /* justify-content: flex-start; */

  /* row */
  width: 100%;
`;

function App() {
  const [tasks, setTasks] = useState<ITask[]>(dataArray);
  const [tasksDone, setTasksDone] = useState<ITask[]>([]);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number, itemType: string) => {
    // console.log("moveTask");
    console.log(tasks[dragIndex]);
    console.log(hoverIndex);
    if(itemType === 'wip') {
      setTasks((prev: ITask[]) =>
        update(prev, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prev[dragIndex] as ITask],
          ],
        })
      );
    }else {
      // setTasksDone(prev => {
      //   prev.splice(dragIndex, 1);
      //   prev.splice(hoverIndex, 0, prev[dragIndex]);
      //   return prev;
      // })
      setTasksDone((prev: ITask[]) =>
        update(prev, { 
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prev[dragIndex] as ITask],
          ],
        })
      );
    }
  }, []);

  // перемещение между таблицами
  const markAsDone = (
    id: string,
    type: string,
    index: number,
    itemType: string
  ) => {
    if (itemType === type) {
      return;
    }
    let curItem: ITask;

    if (type === "done") {
      curItem = tasks.filter((item) => item.id === id)[0];
    } else {
      curItem = tasksDone.filter((item) => item.id === id)[0];
    }

    curItem.status = itemType === "wip" ? "done" : "wip";
   
    if (curItem.status === "done") {
      setTasks((prev) => prev.filter(item => item.id !== curItem.id));
      setTasksDone((prev) => [...prev, curItem]);
    } else {
      setTasksDone((prev) => {
        return prev.filter(item => item.id !== curItem.id);
      });
      setTasks((prev) => [...prev, curItem]);
    }
  };

  return (
    <CardContex.Provider value={{ markAsDone, moveTask }}>
      <DndProvider backend={HTML5Backend}>
        <CenteredDiv>
          <Box>
            <h1>Wip tasks</h1>
            <BoxTarget type="wip">
              {tasks.map((item, index) => (
                <TaskCard
                  id={item.id}
                  key={item.id.toString()}
                  title={item.title}
                  index={index}
                  status={item.status}
                />
              ))}
            </BoxTarget>
          </Box>
          <Box>
            <h1>Wip tasks</h1>
            <BoxTarget type="done">
              {tasksDone.map((item, index) => (
                <TaskCard
                  id={item.id}
                  key={item.id.toString()}
                  title={item.title}
                  index={index}
                  status={item.status}
                />
              ))}
            </BoxTarget>
          </Box>
        </CenteredDiv>
      </DndProvider>
    </CardContex.Provider>
  );
}

export default App;

const dataArray = [
  {
    id: "1",
    status: "wip",
    title: "Milk",
  },
  {
    id: "2",
    status: "wip",
    title: "Apple",
  },
  {
    id: "3",
    status: "wip",
    title: "Banana",
  },
  {
    id: "4",
    status: "wip",
    title: "Banana 2",
  },
  {
    id: "5",
    status: "wip",
    title: "Banana 3",
  },
  {
    id: "6",
    status: "wip",
    title: "Banana 4",
  },
];
