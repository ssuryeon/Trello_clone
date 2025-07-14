import {useRecoilValue, useRecoilState} from 'recoil';
import CreateToDo from './CreateToDo';
import { Categories, toDoSelector, categoryState } from './atoms';
import ToDo from './ToDo';

// useForm, handleValid의 파라미터(데이터) 에 form interface 지정
function ToDoList(){
    const todos = useRecoilValue(toDoSelector);
    const [category, setCategory] = useRecoilState(categoryState);
    const onInput = (event:React.FormEvent<HTMLSelectElement>) => {
        setCategory(event.currentTarget.value as any);
        // console.log(event.currentTarget.value);
    }
    console.log(todos);
    return (
        <div>
            <h1>To Dos</h1>
            <hr></hr>
            <select onInput={onInput} value={category}>
                <option value={Categories.TO_DO}>TO_DO</option>
                <option value={Categories.DOING}>DOING</option>
                <option value={Categories.DONE}>DONE</option>
            </select>
            <CreateToDo />
            <ul>
                {todos.map(toDo => <ToDo key={toDo.id} {...toDo}/>)}
            </ul>
        </div>
    )
}

export default ToDoList;