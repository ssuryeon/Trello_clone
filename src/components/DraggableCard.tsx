import {Draggable} from '@hello-pangea/dnd';
import {styled} from 'styled-components';
import React from 'react';

interface ICard {
	isDragging: boolean,
	destination?: string,
}

const Card = styled.div<ICard>`
	background-color: ${(props) => props.isDragging ? "#fab1a0" :props.theme.cardColor};
	border-radius: 5px;
	padding: 10px 10px;
	margin-bottom: 5px;
	box-shadow: ${(props) => props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.25)" : "none"};
	opacity: ${(props) => props.destination ? props.destination === 'trashcan' ? "0" : "1" : "1"};
`;

interface IDraggableCard {
    toDoText: string,
	toDoId: number,
    index: number,
}

function DraggableCard({toDoText, toDoId, index}:IDraggableCard){
    console.log(toDoText, 'is rendered');
    return (
        <Draggable key={toDoText} draggableId={toDoId + ""} index={index} >
			{(magic, snapshot) => 
				<Card ref={magic.innerRef}
						{...magic.draggableProps}
						{...magic.dragHandleProps} // dragHandleProps를 설정한 객체를 움직일 수 있음\
						isDragging={snapshot.isDragging}
				>{toDoText}</Card>
			}
		</Draggable>
    )
}

export default React.memo(DraggableCard);