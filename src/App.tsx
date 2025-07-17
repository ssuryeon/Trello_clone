import {DragDropContext, DropResult, Droppable} from '@hello-pangea/dnd'
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

const Boards = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-start;
	width: 100%;
	gap: 10px;
`;

const BoardWrapper = styled.div`
	padding: 15px;
	width: 330px;
	height: 100%;
	border: 1px solid red;
`;

const TrashcanWrapper = styled.div`
	// border: 1px solid red;
	margin-top: 30px;
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
	}; 
  return (
	<DragDropContext onDragEnd={onDragEnd}>
		<Wrapper>
			<Boards>
				{
					Object.keys(toDos).map((boardId, index) =>
						<Droppable droppableId={boardId + "boardarea"} type="board" direction="horizontal">
							{(magic) => (
								<BoardWrapper {...magic.droppableProps} ref={magic.innerRef}>
									<Board boardId={boardId} toDos={toDos[boardId]} index={index}/>
									{/* {magic.placeholder} */}
								</BoardWrapper>
							)}
						</Droppable>
					)
				}
			</Boards>
			<Droppable droppableId='trashcan' type="card">
				{(magic) => (
					<TrashcanWrapper {...magic.droppableProps} ref={magic.innerRef} >
						<FontAwesomeIcon icon={faTrashCan} style={{ fontSize: "30px"}}/>
						<div style={{ display: 'none' }}>{magic.placeholder}</div>
					</TrashcanWrapper>
				)}
			</Droppable>
		</Wrapper>
	</DragDropContext>
  );
}

export default App;
