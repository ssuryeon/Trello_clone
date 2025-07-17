import {atom, selector, useRecoilValue} from 'recoil';

export interface IToDo {
    text: string,
    id: number,
}

interface ItoDoState {
    [key:string]: IToDo[],
}
// atom의 default 값이 string인 key와 sting[]인 value를 가지는 객체이다

export const toDoState = atom<ItoDoState>({
    key: 'toDos',
    default: {
        "To Do": [],
        Doing: [],
        Done: [],
    },
})