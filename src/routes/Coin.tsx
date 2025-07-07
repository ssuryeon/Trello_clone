import {useParams, useLocation, Switch, Route, useRouteMatch} from 'react-router';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {useState, useEffect} from 'react';
import Price from './Price';
import Chart from './Chart';
import {fetchCoinInfo, fetchCoinTickers} from '../api';
import {useQuery} from 'react-query';

interface RouteParams {
    coinId: string;
}
interface RouteState {
    name: string;
}

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;
const Header = styled.div`
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`;
const Title = styled.h1`
    font-size: 48px;
    color: ${props => props.theme.accentColor};
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Overview = styled.div`
    background-color: #222;
    color: ${(props) => props.theme.textColor};
    padding: 20px;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
`;
const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    span:first-child {
        font-size: 10px;
        font-weight: 400;
        margin-bottom: 5px;
        text-transform: uppercase;
    }
    width: 20%;
`;
const Description = styled.p`
    margin: 20px 0px;
`;

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
  }
  
interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
}

const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0;
    gap: 10px;
`;
const Tab = styled.span<{isActive : boolean}>`
    color: ${props => props.isActive? props.theme.accentColor : props.theme.textColor};
    text-transform: uppercase;
    background-color: #222;
    text-align: center;
    padding: 10px 0;
    border-radius: 10px;
`;

function Coin(){
    const {coinId} = useParams<RouteParams>();
    console.log(coinId);
    const {isLoading: infoLoading, data: infoData} = useQuery<InfoData>(['info', coinId], () => fetchCoinInfo(coinId));
    const {isLoading: tickerLoading, data: priceData} = useQuery<PriceData>(['ticker', coinId], () => fetchCoinTickers(coinId));
    const {state} = useLocation<RouteState>();
    const loading = infoLoading || tickerLoading;
    const priceMatch = useRouteMatch(`/${coinId}/price`);
    const chartMatch = useRouteMatch(`/${coinId}/chart`);
    return(
        <Container>
            <Header>
                <Title>{state?.name ? state?.name : loading? "Loading..." : infoData?.name}</Title>
            </Header>
            {loading ? <Loader>Loading...</Loader> : 
                <>
                    <Overview>
                        <OverviewItem>
                            <span>RANK:</span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>SYMBOL:</span>
                            <span>${infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>OPEN SOURCE:</span>
                            <span>{infoData?.open_source ? "Yes" : "No"}</span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>TOTAL SUPPLY:</span>
                            <span>{priceData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>MAX SUPPLY</span>
                            <span>{priceData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                    <Tabs>
                        <Tab isActive={chartMatch !== null}>
                            <Link to={`/${coinId}/chart`}>Chart</Link>
                        </Tab>
                        <Tab isActive={priceMatch !== null}>
                            <Link to={`/${coinId}/price`}>Price</Link>
                        </Tab>
                    </Tabs>
                    <Switch>
                        <Route path={`/:${coinId}/price`}>
                            <Price />
                        </Route>
                        <Route path={`/:${coinId}/chart`}>
                            <Chart coinId={coinId}/>
                        </Route>
                    </Switch>
                </>
            }
        </Container>
    );
}

export default Coin;