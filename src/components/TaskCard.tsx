import React, { useContext, useRef } from "react";
import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import itemTypes from "../models/ItemTypes";
import type { XYCoord, Identifier } from "dnd-core";
import { CardContex } from "../App";

interface IItem {
  type: string;
  id: string;
  index: number;
}

interface TextProps {
  isDragging: boolean;
}

const Text = styled.div<TextProps>`
  background-color: #6fb3f1;
  text-align: center;
  width: 10rem;
  padding: 1rem;
  margin: 1rem auto;
  border: 1px solid black;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};

  /* row */
  height: 10rem;
`;

interface TaskCardProps {
  id: string;
  title: string;
  index: number;
  status: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  index,
  status
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { moveTask } = useContext(CardContex);
  
  const [{ handlerId }, drop] = useDrop<
    IItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: itemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: IItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleX =
        (hoverBoundingRect.left - hoverBoundingRect.right) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      const hoverClientX =
        (clientOffset as XYCoord).x - hoverBoundingRect.right;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      moveTask(dragIndex, hoverIndex, item.type);
      item.index = hoverIndex;
    },
  });

  
  const [{ isDragging }, drag] = useDrag({
    type: itemTypes.CARD,
    item: {
      title: title,
      id: id,
      index: index,
      type: status
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <Text ref={ref} isDragging={isDragging} data-handler-id={handlerId}>
      <h4>{title}</h4>
    </Text>
  );
};

export default TaskCard;
