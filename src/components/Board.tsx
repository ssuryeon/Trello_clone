import {Droppable, Draggable} from '@hello-pangea/dnd';
import DraggableCard from './DraggableCard';
import {styled} from 'styled-components';
import {useRef} from 'react';
import {IToDo, toDoState} from './atoms'
import {useForm} from'react-hook-form';
import { useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
	width: 300px;
	padding-top: 10px;
	background-color: ${(props) => props.theme.boardColor};
	border-radius: 5px;
	min-height: 300px;
	display: flex;
	flex-direction: column;
`;

const Title = styled.h2`
	text-align: center;
	font-weight: 600;
	margin-bottom: 10px;
	font-size: 18px;
`;

interface IAreaProps {
	isDraggingOver: boolean,
	isDraggingFromThisWith: boolean,
}

const Area = styled.div<IAreaProps>`
	background-color: ${(props) => 
		props.isDraggingOver ? 
		"#a29bfe" 
		: props.isDraggingFromThisWith ? 
		"#74b9ff" 
		: "transparent"};
	flex-grow: 1;
	padding: 20px;
	transition: 0.5s;
`;
// isDraggingOver(해당 보드 위를 향해 드래그하고 있으면) => pink
// isDraggingFromThisWith(해당 보드를 떠나도록 드래그하고 있으면) => red

interface IBoard {
    toDos: IToDo[],
    boardId: string,
	index: number,
}

const Form = styled.form`
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
	input {
		width: 100%;
		border: none;
		padding: 5px 8px;
		border-radius: 5px;
	}
`;

interface IForm {
	toDo: string,
}

function Board({toDos, boardId, index}:IBoard){
	const setToDos = useSetRecoilState(toDoState);
	const {register, setValue, handleSubmit} = useForm<IForm>();
	const onValid = ({toDo}:IForm) => {
		const newToDo = {
			id: Date.now(),
			text: toDo,
		}
		setToDos((allBoards) => {
			const updated = {
				...allBoards,
				[boardId]: [...allBoards[boardId], newToDo],
			}
			localStorage.setItem('allBoards', JSON.stringify(updated));
			return updated;
		});
		setValue("toDo", "");
	}
    return (
		<Draggable draggableId={boardId + "board"} index={index}>
			{(magic) => (
				<Wrapper ref={magic.innerRef} {...magic.draggableProps} {...magic.dragHandleProps}>
					<Title>{boardId}</Title>
					<Form onSubmit={handleSubmit(onValid)}>
						<input
							{...register('toDo', {required: true})}
							type="text" 
							placeholder={`Add task on ${boardId}`}
						></input>
					</Form>
					<Droppable droppableId={boardId} type="card">
						{(magic, info) => 
							<Area
								isDraggingOver={info.isDraggingOver}
								isDraggingFromThisWith={Boolean(info.draggingFromThisWith)}
								ref={magic.innerRef} 
								{...magic.droppableProps}
							>
								{
									toDos.map((toDo, index) => (
										<DraggableCard 
											key={toDo.id} 
											toDoText={toDo.text} 
											toDoId={toDo.id} 
											index={index}
										/>
									))
								}
								{magic.placeholder /* 드래그 중인 아이템이 차지하던 공간을 임시로 유지해 줌 */} 
							</Area>
						}
					</Droppable>
				</Wrapper>
			)}
		</Draggable>
    )
}

export default Board;