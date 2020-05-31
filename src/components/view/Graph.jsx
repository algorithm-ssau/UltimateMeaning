import React, {Component} from 'react'
import {EdgeShapes, RandomizeNodePositions, Sigma} from 'react-sigma';
import {SigmaGraphLoader} from "../logic/SigmaGraphLoader";
import styled from "styled-components";
import {nodeAttrs, nodeTypes} from "../../pages/Testing";

const UL = styled.ul`
    font-size: 17px;
    padding: 0;
    margin: 0;
    text-transform: uppercase;
    list-style-type: none;
    display: flex;
    justify-content: space-evenly;
`

const LI = styled.li`
    display: flex;
`

const DOT = styled.div`
    background: #f00;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 5px;
`


const colors = {
    initial: '#d70000',
    answer: '#2390e8',
    question: '#68c432',
    current: '#b956af',
    limit: '#000000'
};

export default class Graph extends Component {
    constructor(props) {
        super(props)

        this.state = {graph: {nodes: [], edges: []}};
        props.onCreate(this);

        this.convertStructureToSigmaGraph = this.convertStructureToSigmaGraph.bind(this);
        this.extractColor = this.extractColor.bind(this);
        this.updateGraph = this.updateGraph.bind(this);
    }

    updateGraph(structure, activeGraphIds) {
        const newGraph = this.convertStructureToSigmaGraph(structure, activeGraphIds);
        const currentGraph = this.state.graph;
        for (let i = currentGraph.nodes.length - 1; i >= 0; i--) {
            currentGraph.nodes.splice(i, 1);
        }
        for (let i = 0; i < newGraph.nodes.length; i++) {
            currentGraph.nodes.push(newGraph.nodes[i]);
        }
        for (let i = currentGraph.edges.length - 1; i >= 0; i--) {
            currentGraph.edges.splice(i, 1);
        }
        for (let i = 0; i < newGraph.edges.length; i++) {
            currentGraph.edges.push(newGraph.edges[i]);
        }
        this.setState({graph: currentGraph});
    }

    convertStructureToSigmaGraph(structure, activeGraphIds) {
        let graph = {
            nodes: [],
            edges: []
        };
        for (const item of structure.nodes) {
            if ([...item.graphIds].filter(id => activeGraphIds.includes(id)).length > 0)
                graph.nodes.push({
                    id: item.id,
                    label: item.text + (item.type === nodeTypes.question ? "?" : ""),
                    color: this.extractColor(item),
                });
        }
        let currentEdgeNumber = 0;
        for (const item of structure.edges) {
            if (activeGraphIds.includes(item.graphId))
                graph.edges.push({
                    id: "e" + currentEdgeNumber++,
                    source: item.source,
                    target: item.target
                });
        }
        return graph;
    }

    extractColor(node) {
        if (node.attrs.includes(nodeAttrs.current)) return colors.current;
        if (node.attrs.includes(nodeAttrs.initial)) return colors.initial;
        if (node.attrs.includes(nodeAttrs.limit)) return colors.limit;
        if (node.type === nodeTypes.question) return colors.question;
        if (node.type === nodeTypes.answer) return colors.answer;
    }

    render() {
        return <div>
            <div>
                <UL>
                    <LI><DOT style={{background: colors.initial}}/>Исходная категория</LI>
                    <LI><DOT style={{background: colors.answer}}/>Ответ</LI>
                    <LI><DOT style={{background: colors.question}}/>Вопрос</LI>
                    <LI><DOT style={{background: colors.current}}/>Текущий вопрос</LI>
                    <LI><DOT style={{background: colors.limit}}/>Предельная категория</LI>
                </UL>
            </div>
            <Sigma renderer="canvas"
                   graph={this.state.graph}
                   settings={{
                       drawEdges: true,
                       drawEdgeLabels: true,
                       labelThreshold: 0,
                       minArrowSize: 10,
                       edgeLabelThreshold: 0,
                   }}
                   onClickNode={e => /*Можно что-то делать*/ null}
                   style={{
                       height: '700px',
                       maxWidth: 'inherit',
                       border: "1px solid gray"
                   }}>
                <SigmaGraphLoader graph={this.state.graph}>
                    <RandomizeNodePositions/>
                </SigmaGraphLoader>
                <EdgeShapes default="arrow"/>
            </Sigma>
        </div>
    }
}
