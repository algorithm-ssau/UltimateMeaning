import {nodeTypes, nodeAttrs} from "../../pages/Testing";

export default class Tester {
    constructor(structure, currentGraphId, onStructureUpdate, onCategoryEnd) {
        this.structure = structure;
        this.currentGraphId = currentGraphId;
        this.onStructureUpdate = onStructureUpdate;
        this.onCategoryEnd = onCategoryEnd;

        this.currentQuestion = this.structure.nodes.find(node => node.graphIds.has(this.currentGraphId));
        this.currentQuestion.attrs.push(nodeAttrs.current);
        this.answerForCurrentQuestion = null;
        this.nextId = 0;

        this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);

        this.onStructureUpdate();
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    getCurrentAnswers() {
        const edges = this.structure.edges.filter(value => value.source === this.currentQuestion.id);
        return edges.map(edge => this.structure.nodes.find(node => node.id === edge.target));
    }

    getAvailableAnswers() {
        const currentAnswers = this.getCurrentAnswers();
        return this.structure.nodes.filter(node => node.type === nodeTypes.answer)
            .filter(x => !currentAnswers.includes(x))
            .filter(x => x !== this.answerForCurrentQuestion);
    }

    addNewAnswer(newAnswerText) {
        const newNode = {
            id: this.currentGraphId + "n" + this.nextId++,
            graphIds: new Set().add(this.currentGraphId),
            type: nodeTypes.answer,
            attrs: [],
            text: newAnswerText
        }
        this.structure.nodes.push(newNode);

        this.addAnswer(newNode);
    }

    addOldAnswer(oldAnswerId) {
        const oldNode = this.structure.nodes.find(node => node.id === oldAnswerId);
        oldNode.graphIds.add(this.currentGraphId);
        this.addAnswer(oldNode);
    }

    addAnswer(node) {
        const newEdge = {
            graphId: this.currentGraphId,
            source: this.currentQuestion.id,
            target: node.id
        };
        this.structure.edges.push(newEdge);

        this.onStructureUpdate();
    }

    nextQuestion() {
        const structure = this.structure;
        const answers = structure.nodes.filter(node => node.type === nodeTypes.answer);
        const ofCurrentGraph = answers.filter(node => node.graphIds.has(this.currentGraphId) && node.graphIds.size === 1);
        if (ofCurrentGraph.length === 0) {
            alert("Необходимо добавить хотя бы один ответ.");
            return;
        }

        const withoutQuestions = ofCurrentGraph.filter(node => structure.edges.filter(edge => edge.source === node.id).length === 0);

        this.currentQuestion.attrs = this.currentQuestion.attrs.filter(item => item !== nodeAttrs.current);

        if (withoutQuestions && withoutQuestions.length > 0) {
            this.addNewQuestion(withoutQuestions[0]);
            this.onStructureUpdate();
        } else {
            this.removeQuestionsWithoutAnswers(structure);
            this.markLimitCategories(structure);
            this.onStructureUpdate();
            this.onCategoryEnd();
        }
    }

    removeQuestionsWithoutAnswers(structure) {
        const questions = structure.nodes.filter(node => node.type === nodeTypes.question);
        const withoutAnswers = questions.filter(node => structure.edges.filter(edge => edge.source === node.id).length === 0);
        withoutAnswers.forEach(node => structure.nodes = structure.nodes.filter(item => item !== node));
        withoutAnswers.forEach(node => structure.edges = structure.edges.filter(edge => edge.target !== node.id));
    }

    markLimitCategories(structure) {
        const answers = structure.nodes.filter(node => node.type === nodeTypes.answer);
        const withoutQuestions = answers.filter(node => structure.edges.filter(edge => edge.source === node.id).length === 0);
        withoutQuestions.forEach(node => node.attrs.push(nodeAttrs.limit));
    }

    addNewQuestion(answer) {
        const newQuestion = {
            id: this.currentGraphId + "n" + this.nextId++,
            graphIds: new Set().add(this.currentGraphId),
            type: nodeTypes.question,
            attrs: [nodeAttrs.current],
            text: "Зачем людям " + answer.text.replace("Чтобы ", "")
        }
        const newEdge = {
            graphId: this.currentGraphId,
            source: answer.id,
            target: newQuestion.id
        };

        this.structure.nodes.push(newQuestion);
        this.structure.edges.push(newEdge);

        this.currentQuestion = newQuestion;
        this.answerForCurrentQuestion = answer;
    }
}
