import React, {Component} from 'react'
import styled from "styled-components";
import AnswersForm from "../components/view/AnswersForm";
import Tester from "../components/logic/Tester";
import Graph from "../components/view/Graph";
import SourceCategoryForm from "../components/view/SourceCategoryForm";

const Table = styled.table`
    width: 100%;
`

const Column = styled.td`
    vertical-align: top;
    width: 50%;
    padding: 10px;
`

const LeftColumn = styled(Column)`
    padding-left: 20px;
`

const RightColumn = styled(Column)`
    padding-right: 20px;
`

export const nodeTypes = {
    question: "question",
    answer: "answer"
}
export const nodeAttrs = {
    initial: "initial",
    current: "current",
    limit: "limit"
}
export const modes = {
    categories: "categories",
    testing: "testing"
}

class Testing extends Component {
    constructor(props) {
        super(props)

        this.state = {
            graphComponent: null,
            currentGraphId: -1,
            mode: modes.categories,
            structure: {nodes: [], edges: []},
            categoryToGraphMapping: [],
        };

        this.setGraphComponent = this.setGraphComponent.bind(this);
        this.onStructureUpdate = this.onStructureUpdate.bind(this);
        this.onCategoryEnd = this.onCategoryEnd.bind(this);
        this.onCategoryAdd = this.onCategoryAdd.bind(this);
        this.onTestingEnd = this.onTestingEnd.bind(this);
    }

    setGraphComponent(graphComponent) {
        this.setState({graphComponent});
        this.onStructureUpdate();
    }

    startTesting(sourceCategory) {
        this.state.currentGraphId++;
        const initialNode = {
            id: this.state.currentGraphId + "nInitial",
            graphIds: new Set().add(this.state.currentGraphId),
            type: nodeTypes.question,
            attrs: [nodeAttrs.initial],
            text: sourceCategory.text
        }
        this.state.structure.nodes.push(initialNode);
        this.state.categoryToGraphMapping.push({
            sourceCategory: sourceCategory,
            graphId: this.state.currentGraphId,
            visible: true
        });
        this.tester = new Tester(this.state.structure, this.state.currentGraphId, this.onStructureUpdate, this.onCategoryEnd);
        this.showOnlyCurrentGraph();
    }

    onStructureUpdate() {
        if (this.state.graphComponent)
            this.state.graphComponent.updateGraph(
                this.state.structure,
                this.state.categoryToGraphMapping.filter(value => value.visible).map(value => value.graphId)
            );
        this.forceUpdate();
    }

    onCategoryEnd() {
        this.state.tester = null;
        this.state.mode = modes.categories;
        this.showAllGraphs();
        this.forceUpdate();
    }

    onCategoryAdd(category) {
        this.state.mode = modes.testing;
        this.startTesting(category);
    }

    onTestingEnd() {

    }

    showOnlyCurrentGraph() {
        this.state.categoryToGraphMapping.forEach(value => value.visible = value.graphId === this.state.currentGraphId);
        this.onStructureUpdate();
    }

    showAllGraphs() {
        this.state.categoryToGraphMapping.forEach(value => value.visible = true);
        this.onStructureUpdate();
    }

    render() {
        let section;
        switch (this.state.mode) {
            case modes.testing:
                section = <div>
                    <AnswersForm tester={this.tester}/>
                    <input type="checkbox"
                           id={"showingCheckBox"}
                           onChange={(event) => {
                               if (event.target.checked)
                                   this.showAllGraphs();
                               else
                                   this.showOnlyCurrentGraph();
                           }}/>
                    <label htmlFor="showingCheckBox">&nbsp;Показать все графы</label>
                </div>;
                break;

            case modes.categories:
                section = <SourceCategoryForm
                    categoryToGraphMapping={this.state.categoryToGraphMapping}
                    onCategoryAdd={this.onCategoryAdd}
                    onTestingEnd={this.onTestingEnd}
                    onShowingGraphChange={this.onStructureUpdate}
                />;
                break;

            default:
                alert("Что?");
        }

        return <div>
            <Table>
                <tbody>
                <tr>
                    <LeftColumn>{section}</LeftColumn>
                    <RightColumn>
                        <Graph onCreate={this.setGraphComponent}/>
                    </RightColumn>
                </tr>
                </tbody>
            </Table>
        </div>
    }
}

export default Testing
