import {IToDo, toDoState, Categories} from './atoms'
import { useSetRecoilState } from 'recoil';
import React from "react";

function ToDo({text, id, category}:IToDo){
    const setToDos = useSetRecoilState(toDoState);
    const onClick = (event:React.MouseEvent<HTMLButtonElement>) => {
        const {currentTarget:{name}} = event;
        setToDos((oldToDos) => {
            const targetIndex = oldToDos.findIndex(toDo => toDo.id == id);
            const newToDo = { text, id, category:name as any };
            return [...oldToDos.slice(0, targetIndex), newToDo, ...oldToDos.slice(targetIndex + 1)];
        })
    }
    return( 
        <li>
            <span>{text}</span>
            {category !== Categories.DOING && (<button onClick={onClick} name={Categories.DOING}>Doing</button>)}
            {category !== Categories.TO_DO && (<button onClick={onClick} name={Categories.TO_DO}>To Do</button>)}
            {category !== Categories.DONE && (<button onClick={onClick} name={Categories.DONE}>Done</button>)}
        </li>
    )
}

export default ToDo;