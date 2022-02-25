import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import itemTypes from "../models/ItemTypes";
import styled from "styled-components";
import { CardContex } from "../App";

interface BoxProps {
  isOver: boolean;
}

const Box = styled.div<BoxProps>`
  /* min-height: 40rem; */
  /* width: 100%; */
  background-color: ${(props) => (props.isOver ? "red" : "azure")};

  /* row */
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 40rem;

`;

interface BoxTargetProps {
  type: string;
}

interface IItem {
    type: string;
    id:string; 
    index: number;
}

const BoxTarget: React.FC<BoxTargetProps> = (props) => {
  const { markAsDone } = useContext(CardContex);

  const [{ isOver }, drop] = useDrop({
    accept: itemTypes.CARD,
    drop: (item:IItem, monitor) => {        
      markAsDone(item.id, props.type, item.index, item.type);
    },
    // canDrop: (item, monitor) => {
    //     const itemIndex = statuses.findIndex(si => si.status === item.status);
    //     const statusIndex = statuses.findIndex(si => si.status === status);
    //     return [itemIndex + 1, itemIndex - 1, itemIndex].includes(statusIndex);
    // },
    // drop: (item, monitor) => {
    //     onDrop(item, monitor, status);
    // },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Box ref={drop} isOver={isOver}>
      {props.children}
    </Box>
  );
};

export default BoxTarget;
