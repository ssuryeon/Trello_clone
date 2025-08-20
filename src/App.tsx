import {DragDropContext, DropResult, Droppable, Draggable} from '@hello-pangea/dnd'
import {styled} from 'styled-components';
import {toDoState} from './components/atoms';
import {useRecoilState} from 'recoil';
import Board from './components/Board';
import {useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100vw;
	margin: 0 auto;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

interface IBoards {
	isDraggingover: boolean,
	isDraggingFromWith: boolean,
}

const Boards = styled.div<IBoards>`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	gap: 10px;
`;

const BoardWrapper = styled.div`
	padding: 15px;
	width: 330px;
	height: 100%;
`;

const TrashcanWrapper = styled.div<{isDraggingOver: boolean}>`
	// border: 1px solid red;
	margin-top: 30px;
	svg {
		font-size: 30px;
		color: ${(props) => props.isDraggingOver ? 'gold' : 'white'};
		transition: 0.5s;
	}
`;

function App() {
	const [toDos, setToDos] = useRecoilState(toDoState);
	useEffect(() => {
		const allBoards = localStorage.getItem('allBoards');
		if (allBoards) setToDos(JSON.parse(allBoards));
	}, []);
	const onDragEnd = (info:DropResult) => {
		console.log(info);
		const {destination, source, draggableId} = info;
		if(!destination) return;
		if (['To Do', 'Doing', 'Done'].includes(source.droppableId)){
			if(destination.droppableId === 'trashcan') {
				console.log('trashcan');
				setToDos((allBoards) => {
					const boardCopy = [...allBoards[source.droppableId]];
					boardCopy.splice(source.index, 1);
					const updated = {
						...allBoards,
						[source.droppableId]: boardCopy,
					}
					localStorage.setItem('allBoards', JSON.stringify(updated));
					return updated;
				})
				return;
			}
			if(destination.droppableId === source.droppableId) {
				setToDos((allBoards) => {
					const boardCopy = [...allBoards[destination.droppableId]];
					const taskObj = boardCopy[source.index];
					boardCopy.splice(source.index,1);
					boardCopy.splice(destination?.index, 0, taskObj);
					const updated = {
						...allBoards,
						[destination.droppableId]:boardCopy, // 자바스크립트에서 알아서 대체해 줌
					};
					localStorage.setItem('allBoards', JSON.stringify(updated));
					return updated;
				})
			}
			if(destination.droppableId !== source.droppableId) {
				setToDos((allBoards) => {
					const sourceBoard = [...allBoards[source.droppableId]]
					const destinationBoard = [...allBoards[destination.droppableId]]
					const taskObj = sourceBoard[source.index];
					sourceBoard.splice(source.index,1);
					destinationBoard.splice(destination.index, 0, taskObj);
					const updated = {
						...allBoards,
						[source.droppableId]: sourceBoard,
						[destination.droppableId]: destinationBoard,
					};
					localStorage.setItem('allBoards', JSON.stringify(updated));
					return updated;
				})
			}
		}
		else if(source.droppableId === 'boards'){
			setToDos((allBoards) => {
				const boardCopy = Object.entries(allBoards);
				const taskBoard = boardCopy[source.index];
				boardCopy.splice(source.index, 1);
				boardCopy.splice(destination.index, 0, taskBoard);
				const updated = Object.fromEntries(boardCopy)
				localStorage.setItem('allBoards', JSON.stringify(updated))
				return updated;
			})
		}
	}; 
  return (
	<DragDropContext onDragEnd={onDragEnd}>
		<Wrapper>
		<Droppable droppableId="boards" type="board" direction="horizontal">
			{(magic, info) => (
				<Boards 
					{...magic.droppableProps} 
					ref={magic.innerRef}
					isDraggingover={info.isDraggingOver}
					isDraggingFromWith={Boolean(info.draggingFromThisWith)}
				>
					{
						Object.keys(toDos).map((boardId, index) =>
							<Draggable draggableId={boardId} index={index} key={boardId}>
								{(magic, snapshot) => (
									<BoardWrapper ref={magic.innerRef} {...magic.draggableProps} {...magic.dragHandleProps}>
										<Board boardId={boardId} toDos={toDos[boardId]} index={index} isDragging={snapshot.isDragging}/>
									</BoardWrapper>
								)}
							</Draggable>
						)
					}
					{magic.placeholder}
				</Boards>
			)}
			</Droppable>
			<Droppable droppableId='trashcan' type="card">
				{(magic, info) => (
					<TrashcanWrapper {...magic.droppableProps} ref={magic.innerRef} isDraggingOver={info.isDraggingOver}>
						<FontAwesomeIcon icon={faTrashCan}/>
						<div style={{ display: 'none' }}>{magic.placeholder}</div>
					</TrashcanWrapper>
				)}
			</Droppable>
		</Wrapper>
	</DragDropContext>
  );
}

export default App;
