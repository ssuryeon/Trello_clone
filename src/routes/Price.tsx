import {useLocation} from 'react-router';

interface RouteState {
    currentPrice: number,
}

interface IPrice {
    coinId: string;
}

function Price({coinId}: IPrice){
    const {state} = useLocation<RouteState>();
    return <h3>{state.currentPrice}</h3>
}

export default Price;