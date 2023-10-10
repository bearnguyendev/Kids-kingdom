import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
ChartJS.register(
    Title, Tooltip, LineElement, Legend,
    CategoryScale, LinearScale, PointElement, Filler
)
class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {}
        }
    }
    componentDidMount() {

    }
    render() {
        let { chartData } = this.props
        return (
            <div className="chart d-flex" style={{ width: '70%', height: 'auto', margin: 'auto' }}>
                <Line
                    data={chartData}
                />
            </div>
        )
    }
}

export default Chart;