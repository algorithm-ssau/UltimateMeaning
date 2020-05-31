import React from "react";
import {nodeTypes, nodeAttrs} from "../../pages/Testing";

export default class StatisticsCalculator extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {loaded: false};
    }

    analyze(structure) {
        return {
            limitCategoriesCount: this.getLimitCategories(structure).length,
            nodalCategoriesCount: this.getNodalCategories(structure).length,
            connectivityIndex: this.getConnectivityIndex(structure),
            allCategoriesCount: this.getAllAnswers(structure).length,
            averageChainsLength: this.getAverageChainsLength(structure),
            productivity: this.getProductivity(structure)
        };
    }

    getLimitCategories(structure) {
        return structure.nodes
            .filter(node => node.type === nodeTypes.answer)
            .filter(node => structure.edges.filter(edge => edge.source === node.id).length === 0);
    }

    getNodalCategories(structure) {
        return structure.nodes
            .filter(node => node.type === nodeTypes.answer)
            .filter(node => structure.edges.filter(edge => edge.target === node.id).length > 1);
    }

    getConnectivityIndex(structure) {
        return this.getNodalCategories(structure).length / this.getLimitCategories(structure).length;
    }

    getAllAnswers(structure) {
        return structure.nodes
            .filter(node => node.type === nodeTypes.answer);
    }

    getAverageChainsLength(structure) {
        const sourceCategories = this.getSourceCategories(structure);
        const limitCategories = this.getLimitCategories(structure);
        const averagePathLengths = [];

        for (const sourceCategory of sourceCategories) {
            // Узлы-вопросы не считаем.
            // Останавливаемся на каждом вопросе, храним все пройденные ответы.
            let states = [
                {
                    currentNode: sourceCategory,
                    prevAnswers: []
                }
            ];
            while (states.length > 0) {
                const newStates = [];
                for (const state of states) {
                    structure.edges
                        // Получаем все исходящие из вопроса рёбра.
                        .filter(edge => edge.source === state.currentNode.id)
                        // Преборазуем их в ответы на этот вопрос.
                        .map(edge => structure.nodes.find(node => node.id === edge.target))
                        // Оставляем только те, которые не посещали ранее.
                        .filter(node => !state.prevAnswers.includes(node))
                        .forEach(answer => {
                            if (limitCategories.includes(answer)) {
                                averagePathLengths.push(state.prevAnswers.length + 1);
                            } else {
                                newStates.push({
                                    // Переходим на вопрос об этом ответе.
                                    currentNode: structure.nodes.find(node2 => node2.id === structure.edges
                                        .find(edge => edge.source === answer.id).target),
                                    prevAnswers: [...state.prevAnswers, answer]
                                });
                            }
                        });
                    states = newStates;
                }
            }
        }
        return averagePathLengths.reduce((a, b) => a + b, 0) / averagePathLengths.length;
    }

    getProductivity(structure) {
        return this.getAllAnswers(structure).length / this.getSourceCategories(structure).length;
    }

    getSourceCategories(structure) {
        return structure.nodes
            .filter(node => node.type === nodeTypes.question && node.attrs.includes(nodeAttrs.initial));
    }
}
