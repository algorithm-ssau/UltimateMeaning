import React from "react";

export class SigmaGraphLoader extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {loaded: false};
    }

    componentDidMount() {
        this._load(this.props.graph)
    }

    componentDidUpdate(props) {
        if (props.graph !== this.props.sigma.graph) {
            this.setState({loaded: false})
            this._load(props.graph)
        }
    }

    embedProps(elements, extraProps) {
        return React.Children.map(elements, (element) => React.cloneElement(element, extraProps))
    }

    render() {
        if (!this.state.loaded)
            return null
        return <div>{this.embedProps(this.props.children, {sigma: this.props.sigma})}</div>
    }

    _load(graph) {
        let s = this.props.sigma;

        if (graph && typeof (graph) != 'undefined' && typeof s != 'undefined') {
            s.graph.clear();
            s.graph.read(graph);
            s.graph.nodes().forEach(function (node, i, a) {
                // Круговое расположение, детерминировано, но больше вероятность пересечений.
                node.x = Math.cos(Math.PI * 2 * i / a.length);
                node.y = Math.sin(Math.PI * 2 * i / a.length);

                // Случайное расположение, иногда помогает против пересечений, но каждый раз новое расположение.
                // TODO: Можно будет попробовать http://davidbau.com/encode/seedrandom.js
                // node.x = Math.random();
                // node.y = Math.random();

                node.size = 8;
            });

            s.refresh();

            // Вроде бы такие константы помогают более-менее избавиться от пересечений при круговом расположении.
            // При большем таймауте граф может и лучше утрясывается, но начинают проявляться проблемы асинхронности,
            // решать которые, конечно же, не хочется.
            s.startForceAtlas2({
                worker: false,
                linLogMode: false,
                barnesHutOptimize: true,
                barnesHutTheta: 3,
                iterationsPerRender: 10
            });
            setTimeout(() => s.killForceAtlas2(), 100);
        }
        this.setState({loaded: true})
    }
}
