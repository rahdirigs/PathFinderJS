import React, { Component } from 'react'
import Node from './node/Node'
import { dijkstra } from '../algorithms/dijkstra'
import { dfs } from '../algorithms/dfs'
import { bfs } from '../algorithms/bfs'
import { aStar } from '../algorithms/aStar'
import './Visualizer.css'
import Header from './header/Header'
import Button from '@material-ui/core/Button'

export default class Visualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            START_NODE_R: 5,
            START_NODE_C: 5,
            FINISH_NODE_R: 15,
            FINISH_NODE_C: 15,
            mousePress: false,
            ROW_COUNT: 20,
            COL_COUNT: 35,
            MOBILE_ROW_COUNT: 10,
            MOBILE_COL_COUNT: 20,
            isRunning: false,
            isStartNode: false,
            isFinishNode: false,
            isWallNode: false,
            curRow: 0,
            curCol: 0,
            isDesktop: true,
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.toggleIsRunning = this.toggleIsRunning.bind(this);
    }

    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }

    //Creation of grid
    getInitialGrid = (rowCount = this.state.ROW_COUNT, colCount = this.state.COL_COUNT) => {
        const initialGrid = [];

        for (let row = 0; row < rowCount; row++) {
            const currentRow = []
            for (let col = 0; col < colCount; col++) {
                currentRow.push(this.createNode(row, col));
            }
            initialGrid.push(currentRow);
        }
        
        return initialGrid;
    };

    //Node creation
    createNode = (row, col) => {
        return {
            row,
            col,
            isStart:
                row === this.state.START_NODE_R && col === this.state.START_NODE_C,
            isFinish:
                row === this.state.FINISH_NODE_R && col === this.state.FINISH_NODE_C,
            distance: Infinity,
            factor: Infinity,
            distanceToFinish:
                Math.abs(this.state.FINISH_NODE_R - row) + Math.abs(this.state.FINISH_NODE_C - col),
            isVisited: false,
            isWall: false,
            previousNode: null,
            isNode: true,
        };
    };

    //Toggle state of the app
    toggleIsRunning() {
        this.setState({ isRunning: !this.state.isRunning });
    }

    //Toggle between desktop and mobile view
    toggleView() {
        if (!this.state.isRunning) {
            this.clearGrid();
            this.clearWalls();
            const isDesktop = !this.state.isDesktop;
            let grid;

            if (isDesktop) {
                grid = this.getInitialGrid(
                    this.state.ROW_COUNT,
                    this.state.COL_COUNT,
                );
                this.setState({ isDesktop, grid });
            } else {
                if (
                    this.state.START_NODE_R > this.state.MOBILE_ROW_COUNT ||
                    this.state.START_NODE_C > this.state.MOBILE_COL_COUNT ||
                    this.state.FINISH_NODE_R > this.state.MOBILE_ROW_COUNT ||
                    this.state.FINISH_NODE_C > this.state.MOBILE_COL_COUNT
                ) {
                    alert('Start and Finish Nodes must be within 10 row x 20 column area from the top left!!!');
                } else {
                    grid = this.getInitialGrid(
                        this.state.MOBILE_ROW_COUNT,
                        this.state.MOBILE_COL_COUNT,
                    );
                    this.setState({ isDesktop, grid });
                }
            }
        }
    }

    //method to clear the grid
    clearGrid() {
        if (!this.state.isRunning) {
            const newGrid = this.state.grid.slice();

            for (const row of newGrid) {
                for (const node of row) {
                    let nodeClassName = document.getElementById(
                        `node-${node.row}-${node.col}`,
                    ).className;

                    if (
                        nodeClassName !== 'node node-start' &&
                        nodeClassName !== 'node node-finish' &&
                        nodeClassName !== 'node node-wall'
                    ) {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.factor = Infinity;
                        node.distanceToFinish =
                            Math.abs(this.state.FINISH_NODE_R - node.row) + Math.abs(this.state.FINISH_NODE_C - node.col);
                    }

                    if (nodeClassName === 'node node-finish') {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.factor = Infinity;
                        node.distanceToFinish = 0;
                    }

                    if (nodeClassName === 'node node-start') {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.distanceToFinish =
                            Math.abs(this.state.FINISH_NODE_R - node.row) + Math.abs(this.state.FINISH_NODE_C - node.col);
                        node.factor = Infinity;
                        node.isStart = true;
                        node.isWall = false;
                        node.previousNode = null;
                        node.isNode = true;
                    }
                }
            }
        }
    }

    //method to clear the obstacles
    clearWalls() {
        if (!this.state.isRunning) {
            const newGrid = this.state.grid.slice();
            
            for (const row of newGrid) {
                for (const node of row) {
                    let nodeClassName = document.getElementById(
                        `node-${node.row}-${node.col}`,
                    ).className;

                    if (nodeClassName === 'node node-wall') {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                        node.isWall = false;
                    }
                }
            }
        }
    }

    /*Mouse Handling operations begin*/
    handleMouseDown(row, col) {
        if (!this.state.isRunning) {
            if (this.isGridClear()) {
                if (
                    document.getElementById(`node-${row}-${col}`).className ===
                        'node node-start'
                ) {
                    this.setState({
                        mousePress: true,
                        isStartNode: true,
                        curRow: row,
                        curCol: col
                    });
                } else if (
                    document.getElementById(`node-${row}-${col}`).className ===
                        'node node-finish'
                ) {
                    this.setState({
                        mousePress: true,
                        isFinishNode: true,
                        curRow: row,
                        curCol: col
                    });
                } else {
                    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                    this.setState({
                        grid: newGrid,
                        mousePress: true,
                        isWallNode: true,
                        curRow: row,
                        curCol: col
                    });
                }
            } else {
                this.clearGrid();
            }
        }
    }

    //method to check if the grid is clear
    isGridClear() {
        for (const row of this.state.grid) {
            for (const node of row) {
                const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;

                if (
                    nodeClassName === 'node node-visited' ||
                    nodeClassName === 'node node-shortest-path'
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    handleMouseEnter(row, col) {
        if (!this.state.isRunning) {
            if (this.state.mousePress) {
                const nodeClassName = document.getElementById(`node-${row}-${col}`).className;

                if (this.state.isStartNode) {
                    if (nodeClassName !== 'node node-wall') {
                        const prevStartNode = this.state.grid[this.state.curRow][this.state.curCol];
                        prevStartNode.isStart = false;
                        document.getElementById(`node-${this.state.curRow}-${this.state.curCol}`).className = 'node';
                        this.setState({ curRow: row, curCol: col });
                        const curStartNode = this.state.grid[row][col];
                        curStartNode.isStart = true;
                        document.getElementById(`node-${row}-${col}`).className = 'node node-start';
                    }
                    this.setState({ START_NODE_R: row, START_NODE_C: col });
                } else if (this.state.isFinishNode) {
                    if (nodeClassName !== 'node node-wall') {
                        const prevFinishNode = this.state.grid[this.state.curRow][this.state.curCol];
                        prevFinishNode.isFinish = false;
                        document.getElementById(`node-${this.state.curRow}-${this.state.curCol}`).className = 'node';
                        this.setState({ curRow: row, curCol: col });
                        const curFinishNode = this.state.grid[row][col];
                        curFinishNode.isFinish = true;
                        document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
                    }
                    this.setState({ FINISH_NODE_R: row, FINISH_NODE_C: col });
                } else if (this.state.isWallNode) {
                    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                    this.setState({ grid: newGrid });
                }
            }
        }
    }

    handleMouseUp(row, col) {
        if (!this.state.isRunning) {
            this.setState({ mousePress: false });

            if (this.state.isStartNode) {
                const isStartNode = !this.state.isStartNode;
                this.setState({ isStartNode, START_NODE_R: row, START_NODE_C: col });
            } else if (this.state.isFinishNode) {
                const isFinishNode = !this.state.isFinishNode;
                this.setState({ isFinishNode, FINISH_NODE_R: row, FINISH_NODE_C: col });
            }
            this.getInitialGrid();
        }
    }

    handleMouseLeave() {
        if (this.state.isStartNode) {
            const isStartNode = !this.state.isStartNode;
            this.setState({ isStartNode, mousePress: false });
        } else if (this.state.isFinishNode) {
            const isFinishNode = !this.state.isFinishNode;
            this.setState({ isFinishNode, mousePress: false });
        } else if (this.state.isWallNode) {
            const isWallNode = !this.state.isWallNode;
            this.setState({ isWallNode, mousePress: false });
            this.getInitialGrid();
        }
    }
    /*Mouse Handling Operations end*/

    //Animations
    visualize(algo) {
        if (!this.state.running) {
            this.clearGrid();
            this.toggleIsRunning();
            const { grid } = this.state;
            const startNode = grid[this.state.START_NODE_R][this.state.START_NODE_C];
            const finishNode = grid[this.state.FINISH_NODE_R][this.state.FINISH_NODE_C];

            let visitedNodesInOrder;
            switch (algo) {
                case 'Dijkstra':
                    visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
                    break;
                case 'AStar':
                    visitedNodesInOrder = aStar(grid, startNode, finishNode);
                    break;
                case 'BFS':
                    visitedNodesInOrder = bfs(grid, startNode, finishNode);
                    break;
                case 'DFS':
                    visitedNodesInOrder = dfs(grid, startNode, finishNode);
                    break;
                default:
                    break;
            }

            const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            nodesInShortestPathOrder.push('end');
            this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
        }
    }

    animate(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }

            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
                
                if (
                    nodeClassName !== 'node node-start' &&
                    nodeClassName !== 'node node-finish'
                ) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }
            }, 10 * i);
        }
    }

    //Shortest path output
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            if (nodesInShortestPathOrder[i] === 'end') {
                setTimeout(() => {
                    this.toggleIsRunning();
                }, i * 50);
            } else {
                setTimeout(() => {
                    const node = nodesInShortestPathOrder[i];
                    const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;

                    if (
                        nodeClassName !== 'node node-start' &&
                        nodeClassName !== 'node node-finish'
                    ) {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
                    }
                }, i * 40);
            }
        }
    }

    //render component
    render() {
        const { grid, mousePress } = this.state;
        return (
            <div>
                <Header />
                <table
                    className = "grid-container"
                    onMouseLeave = {() => this.handleMouseLeave()}
                >
                    <tbody className = "grid-body"> {
                        grid.map((row, rowIdx) => {
                            return (
                                <tr key = { rowIdx }> {
                                    row.map((node, nodeIdx) => {
                                        const { row, col, isFinish, isStart, isWall } = node;
                                        return (
                                            <Node
                                                key = { nodeIdx }
                                                col = { col }
                                                isFinish = { isFinish }
                                                isStart = { isStart }
                                                isWall = { isWall }
                                                mousePress = { mousePress }
                                                onMouseDown = {(row, col) => this.handleMouseDown(row, col)}
                                                onMouseEnter = {(row, col) => this.handleMouseEnter(row, col)}
                                                onMouseUp = {() => this.handleMouseUp(row, col)}
                                                row = { row }
                                            ></Node>
                                        );
                                    })
                                }
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>

                <div className = "footer">
                    <Button
                        style={{
                            backgroundColor: "#e5ff00",
                            padding: "5px 10px",
                        }}
                        className = "footer__button"
                        variant = "contained"
                        color = 'inherit'
                        onClick = {() => this.clearWalls()}
                    >Clear Walls</Button>

                    <Button
                        style={{
                            backgroundColor: "#e5ff00",
                            padding: "5px 10px",
                        }}
                        className = "footer__button"
                        variant = "contained"
                        color = 'inherit'
                        onClick = {() => this.clearGrid()}
                    >Clear Grid</Button>

                    <Button
                        style={{
                            backgroundColor: "#77ff00",
                            padding: "5px 10px",
                        }}
                        className = "footer__button"
                        variant = "contained"
                        color = 'inherit'
                        onClick = {() => this.visualize('DFS')}
                    >Depth First Search</Button>

                    <Button
                        style={{
                            backgroundColor: "#26ff00",
                            padding: "5px 10px",
                        }}
                        className = "footer__button"
                        variant = "contained"
                        color = 'inherit'
                        onClick = {() => this.visualize('BFS')}
                    >Breadth First Search</Button>

                    <Button
                        style={{
                            backgroundColor: "#00ff95",
                            padding: "5px 10px",
                        }}
                        className = "footer__button"
                        variant = "contained"
                        color = 'inherit'
                        onClick = {() => this.visualize('Dijkstra')}
                    >Dijkstra's Algorithm</Button>

                    <Button
                        style={{
                            backgroundColor: "#00ffea",
                            padding: "5px 10px",
                        }}
                        className = "footer__button"
                        variant = "contained"
                        color = 'inherit'
                        onClick = {() => this.visualize('AStar')}
                    >A-Star Search</Button>

                    {
                    this.state.isDesktop? (
                        <Button
                            style={{
                                backgroundColor: "#ff52ba",
                                padding: "5px 10px",
                            }}
                            variant = "contained"
                            color = 'inherit'
                            className = "footer__button"
                            onClick = {() => this.toggleView()}
                        >Mobile View</Button>
                    ) : (
                        <Button
                            style={{
                                backgroundColor: "#ff52ba",
                                padding: "5px 10px",
                            }}
                            variant = "contained"
                            color = 'inherit'
                            className = "footer__button"
                            onClick = {() => this.toggleView()}
                        >Desktop View</Button>
                    )  
                    }
                </div>
            </div>
        );
    }
}

//Toggle walls inside the grid
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    
    if (!node.isStart && !node.isFinish && node.isNode) {
        const newNode = {
            ...node,
            isWall: !node.isWall
        };
        newGrid[row][col] = newNode;
    }

    return newGrid;
}

function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let curNode = finishNode;

    while (curNode != null) {
        nodesInShortestPathOrder.unshift(curNode);
        curNode = curNode.previousNode;
    }

    return nodesInShortestPathOrder;
}