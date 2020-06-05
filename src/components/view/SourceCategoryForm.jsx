import React, {Component} from "react";
import styled from "styled-components";

const Title = styled.h1`
    text-align: center;
    margin-top: 10px;
    margin-bottom: 40px;
`

const Table = styled.table`
    margin-bottom: 0;
`

const AddText = styled.label`
    text-size: 20px;
`

const SectionDelimiter = styled.div`
    margin-top: 30px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 0px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
    color: #fff !important;
`

const allSourceCategories = [
    {id: 0, text: "Зачем люди спрашивают вопросы"},
    {id: 1, text: "Зачем люди ищут предельный смысл"},
    {id: 2, text: "Зачем людям дипломы"},
];

export default class SourceCategoryForm extends Component {
    constructor(props) {
        super(props)
        this.state = {};

        this.addCategory = this.addCategory.bind(this);
        this.handleChangeShowingValue = this.handleChangeShowingValue.bind(this);
    }

    handleChangeSelectorValue = async event => {
        const sourceCategoryId = event.target.value;
        this.setState({sourceCategoryId})
    }

    handleChangeShowingValue(categoryMetaInfo) {
        categoryMetaInfo.visible = !categoryMetaInfo.visible;
        this.forceUpdate();
        this.props.onShowingGraphChange();
    }

    getAvailableSourceCategories() {
        return allSourceCategories.filter(x => !this.props.categoryToGraphMapping.map((value) => value.sourceCategory).includes(x));
    }

    addCategory() {
        if (!this.state.sourceCategoryId || this.state.sourceCategoryId === "") {
            alert("Категория не выбрана.");
            return;
        }
        const category = allSourceCategories.find(value => value.id === +this.state.sourceCategoryId);
        this.props.onCategoryAdd(category);
    }

    render() {
        let currentCategories;
        if (this.props.categoryToGraphMapping.length === 0) {
            currentCategories = <label>Нет</label>;
        } else {
            currentCategories = <Table className={"table table-bordered table-responsive-md table-striped"}>
                <tbody>
                {this.props.categoryToGraphMapping.map(function (categoryToGraph) {
                    return <tr>
                        <td>{categoryToGraph.sourceCategory.text + "?"}</td>
                        <td>
                            <input type="checkbox" id={categoryToGraph.sourceCategory.id}
                                   name={categoryToGraph.sourceCategory.id}
                                   value={categoryToGraph.sourceCategory.id}
                                   checked={categoryToGraph.visible}
                                   onChange={() => this.handleChangeShowingValue(categoryToGraph)}/>
                        </td>
                    </tr>;
                }.bind(this))}
                </tbody>
            </Table>;
        }

        return (
            <div>
                <Title>Обзор исходных категорий</Title>
                <label>Текущие категории: </label>
                <br/>
                {currentCategories}
                <SectionDelimiter/>

                <AddText>Добавить новую категорию:</AddText>
                <select className="form-control" onChange={this.handleChangeSelectorValue}
                        value={this.state.sourceCategoryId}>
                    <option value={""}/>
                    {this.getAvailableSourceCategories().map(function (category) {
                        return <option value={category.id}>
                            {category.text + "?"}
                        </option>;
                    })}
                </select>

                <Button onClick={this.addCategory}>Добавить категорию</Button>
                <CancelButton onClick={this.props.onTestingEnd}>Закончить тестирование</CancelButton>
            </div>
        );
    }
}
