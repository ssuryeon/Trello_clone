import {useQuery} from 'react-query';
import {fetchCoinHistory} from '../api';
import ApexCharts from 'react-apexcharts'

interface IHistorical {
    time_open: string;
    time_close: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface ChartProps {
    coinId: string;
}

function Chart({coinId}:ChartProps){
    const {isLoading, data} = useQuery<IHistorical[]>(['ohlcv', coinId], () => fetchCoinHistory(coinId));
    return <div>{isLoading? "loading Chart..." : <ApexCharts 
        type="line"
        series={[
            {
                name: "Price",
                data: data?.map(price => price.close) as number[],
            }
        ]}
        options={{
            theme: {
                mode: "dark",
            },
            chart: {
                width: 500,
                height: 500,
                toolbar: {
                    show: false,
                },
                background: "transparent",
            },
            grid: {
                show: false,
            },
            xaxis: {
                axisTicks: {show: false,},
                labels: {show: false,},
                axisBorder: {show: false,},
                categories: data?.map(price => new Date(price.time_close*1000).toISOString()),
                type: "datetime",
            },
            yaxis: {
                labels: {
                    show: false,
                }
            },
            stroke: {
                curve: "smooth",
            },
            fill: {
                type: "gradient",
                gradient: {
                    gradientToColors: ["#26de81"],
                    stops: [0,100],
                }
            },
            colors: ["#2bcbba"],
            tooltip: {
                y: {
                    formatter: (value) => `$${value.toFixed(3)}`,
                },
            }
        }}
    />}</div>
}

export default Chart;