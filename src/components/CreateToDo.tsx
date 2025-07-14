import { useForm } from 'react-hook-form';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {toDoState, categoryState} from './atoms';

interface IForm {
    todo: string,
}

function CreateToDo() {
    const {handleSubmit, register, setValue} = useForm<IForm>();
    const setToDos = useSetRecoilState(toDoState);
    const category = useRecoilValue(categoryState);
    const handleValid = ({todo}:IForm) => {
        setToDos(oldToDo => [{text: todo, id: Date.now(), category},...oldToDo]);
        setValue("todo", "");
    }
    return (
        <form onSubmit={handleSubmit(handleValid)}>
                <input type="text" {...register('todo', {
                    required: "Please write a to do",
                })}/>
                <button>Add</button>
        </form>
    )
}

export default CreateToDo;