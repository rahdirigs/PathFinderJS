export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    let nextNodeStack = [startNode];

    while (nextNodeStack.length) {
        const curNode = nextNodeStack.shift();

        if (curNode === finishNode) {
            return visitedNodesInOrder;
        }

        if (!curNode.isWall && (curNode.isStart || !curNode.isVisited)) {
            curNode.isVisited = true;
            visitedNodesInOrder.push(curNode);
            
            const { col, row } = curNode;
            let nextNode;

            if (row > 0) {
                nextNode = grid[row - 1][col];

                if (!nextNode.isVisited) {
                    nextNode.previousNode = curNode;
                    nextNodeStack.push(nextNode);
                }
            }

            if (row < grid.length - 1) {
                nextNode = grid[row + 1][col];
                if (!nextNode.isVisited) {
                    nextNode.previousNode = curNode;
                    nextNodeStack.push(nextNode);
                }
            }

            if (col > 0) {
                nextNode = grid[row][col - 1];
                if (!nextNode.isVisited) {
                    nextNode.previousNode = curNode;
                    nextNodeStack.push(nextNode);
                }
            }

            if (col < grid[0].length - 1) {
                nextNode = grid[row][col + 1];
                if (!nextNode.isVisited) {
                    nextNode.previousNode = curNode;
                    nextNodeStack.push(nextNode);
                }
            }
        }
    }

    return [];
}