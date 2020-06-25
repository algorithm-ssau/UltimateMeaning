import React, {Component} from "react";
import StatisticsCalculator from "../logic/StatisticsCalculator";
import styled from "styled-components";
import * as html2canvas from 'html2canvas';
import {nodeAttrs} from "../../pages/Testing";

const CategoriesTitle = styled.p`
    margin-top: 20px;
    margin-bottom: 0;
`
const Categories = styled.div`
    height: 239px;
    overflow: auto;
    padding: 10px;
    padding-left: 20px;
    border: 1px solid gray;
`
const Category = styled.p`

`

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

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 0px;
`

export default class Statistics extends Component {
    constructor(props) {
        super(props)
        this.values = new StatisticsCalculator().analyze(props.structure);
    }

    getUltimateMeanings(structure) {
        return structure.nodes
            .filter(node => node.attrs.includes(nodeAttrs.limit))
            .map(node => node.text);
    }

    render() {
        const capture = () => {
            html2canvas(document.querySelector("#graph"))
                .then(function (canvas) {
                    const base64URL = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                    const element = document.createElement('a');
                    element.setAttribute('href', base64URL);
                    element.setAttribute('download', 'image.png');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                });
        };

        const textDownload = () => {
            const element = document.createElement('a');
            let content = "";
            content += "Абсолютное число предельных категорий: ";
            content += this.values.limitCategoriesCount + "\n";
            content += "Абсолютное число узловых категорий: ";
            content += this.values.nodalCategoriesCount + "\n";
            content += "Индекс связности полученной структуры: ";
            content += this.values.connectivityIndex + "\n";
            content += "Абсолютное число всех неповторяющихся категорий: ";
            content += this.values.allCategoriesCount + "\n";
            content += "Средняя длина цепей: ";
            content += this.values.averageChainsLength + "\n";
            content += "Продуктивность: ";
            content += this.values.productivity + "\n";
            content += "\nНайденные предельные смыслы:\n"
            const categories = this.getUltimateMeanings(this.props.structure);
            categories.forEach(text => content += text + "\n");
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', "Statistics.txt");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };

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
                <CategoriesTitle>Найденные предельные смыслы:</CategoriesTitle>
                <Categories>
                    {
                        this.getUltimateMeanings(this.props.structure).map(text => {
                            return <Category>{text}</Category>;
                        })
                    }
                </Categories>
                <CancelButton onClick={this.props.onReset}>Начать сначала</CancelButton>
                <Button onClick={textDownload}>Скачать статистику</Button>
                <Button onClick={capture}>Скачать граф</Button>
            </div>
        );
    }
}
