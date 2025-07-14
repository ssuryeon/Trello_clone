import {atom, selector} from 'recoil';

export enum Categories {
    "TO_DO" = "TO_DO",
    "DOING" = "DOING",
    "DONE" = "DONE",
}

export interface IToDo {
    text: string,
    id: number,
    category: Categories,
}

export const toDoState = atom<IToDo[]>({
    key: 'toDos',
    default: [],
})

export const toDoSelector = selector({
    key: "toDoSelector",
    get: ({get}) => { // 파라미터에 있는 option 객체에서 get 함수를 불러옴
        const toDos = get(toDoState);
        const category = get(categoryState);
        return toDos.filter(toDo => toDo.category === category); // 특정 카테고리의 todo만 리턴함
    }
})

export const categoryState = atom<Categories>({
    key: 'category',
    default: Categories.TO_DO,
})