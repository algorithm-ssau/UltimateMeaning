import React, {Component} from "react";
import StatisticsCalculator from "../logic/StatisticsCalculator";
import styled from "styled-components";

const Title = styled.h1`
    text-align: center;
    margin-top: 10px;
    margin-bottom: 40px;
`

const Table = styled.table`
    margin-bottom: 0;
    white-space: nowrap;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
    color: #fff !important;
`

export default class Statistics extends Component {
    constructor(props) {
        super(props)
        this.values = new StatisticsCalculator().analyze(props.structure);
    }

    render() {
        return (
            <div>
                <Title>Статистика</Title>
                <Table className={"table table-bordered table-responsive-md table-striped"}>
                    <thead>
                    <tr>
                        <td>Название статистики</td>
                        <td>Значение</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={{width: "1px"}}>Абсолютное число предельных категорий</td>
                        <td>{this.values.limitCategoriesCount}</td>
                    </tr>
                    <tr>
                        <td>Абсолютное число узловых категорий</td>
                        <td>{this.values.nodalCategoriesCount}</td>
                    </tr>
                    <tr>
                        <td>Индекс связности полученной структуры</td>
                        <td>{this.values.connectivityIndex}</td>
                    </tr>
                    <tr>
                        <td>Абсолютное число всех неповторяющихся категорий</td>
                        <td>{this.values.allCategoriesCount}</td>
                    </tr>
                    <tr>
                        <td>Средняя длина цепей</td>
                        <td>{this.values.averageChainsLength}</td>
                    </tr>
                    <tr>
                        <td>Продуктивность</td>
                        <td>{this.values.productivity}</td>
                    </tr>
                    </tbody>
                </Table>
                <CancelButton onClick={this.props.onReset}>Начать сначала</CancelButton>
            </div>
        );
    }
}
