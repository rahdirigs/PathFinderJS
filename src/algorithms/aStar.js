export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.factor = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length) {
        sortByFactor(unvisitedNodes);
        const bestNode = unvisitedNodes.shift();

        if (!bestNode.isWall) {
            if (bestNode.factor === Infinity) {
                return visitedNodesInOrder;
            }

            bestNode.isVisited = true;
            visitedNodesInOrder.push(bestNode);

            if (bestNode === finishNode) {
                return visitedNodesInOrder;
            }

            updateUnvisitedNeighbours(bestNode, grid);
        }
    }

    return [];
}

function getAllNodes(grid) {
    const nodes = [];
    
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }

    return nodes;
}

function sortByFactor(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.factor - nodeB.factor);
}

function updateUnvisitedNeighbours(node, grid) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);

    for (const neighbour of unvisitedNeighbours) {
        neighbour.factor = node.factor + 1 + node.distanceToFinish;
        neighbour.previousNode = node;
    }
}

function getUnvisitedNeighbours(node, grid) {
    const neighbours = [];
    const { col, row } = node;
    
    if (row > 0) {
        neighbours.push(grid[row - 1][col]);
    }

    if (row < grid.length - 1) {
        neighbours.push(grid[row + 1][col]);
    }

    if (col > 0) {
        neighbours.push(grid[row][col - 1]);
    }

    if (col < grid[0].length - 1) {
        neighbours.push(grid[row][col + 1]);
    }

    return neighbours.filter(neighbour => !neighbour.isVisited);
}