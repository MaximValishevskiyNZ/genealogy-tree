import { createContext, useState, useCallback, useEffect } from 'react';
import { applyNodeChanges, applyEdgeChanges, NodeProps, Edge, OnEdgesChange, OnNodesChange, Node, NodeChange, Node, EdgeChange } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { FamilyMemberNodeData } from './components/FamilyMember/FamilyMemberNode';



const initialNodes = [
  { id: '1', position: { x: 300, y: 300 }, data: { firstName: 'Иван', secondName: 'Иванов', sex: 'M', dateOfBirth: new Date(), root: true  }, type: 'custom'},
];


const loadNodes = () => {
  const saved = localStorage.getItem('nodes');
  if (saved) {
    const nodes = JSON.parse(saved);
    return nodes.map((node: NodeProps<FamilyMemberNodeData>): NodeProps<FamilyMemberNodeData> => ({
      ...node,
      data: { ...node.data, dateOfBirth: new Date(node.data.dateOfBirth) },
    }));
  }
  return initialNodes;
};

const loadEdges = () => {
  const saved = localStorage.getItem('edges');
  if (saved) {
    return JSON.parse(saved);
  }
};

interface FlowContextType {
  nodes: NodeProps<FamilyMemberNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNewMember: (sourceId: string, firstName: string, secondName: string, sex: string, dateOfBirth: Date, relation: 'parent' | 'child') => void;
  editMember: (id: string, firstName: string, secondName: string, sex: string, dateOfBirth: Date) => void;
  deleteMember: (id: string) => void;
}


export const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider = ({ children }) => {
  const [nodes, setNodes] = useState(loadNodes);
  const [edges, setEdges] = useState(loadEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    []
  );

  const addNewMember = (sourceId: string, firstName: string, secondName: string, sex: string, dateOfBirth: Date, relation: 'parent' | 'child') => {
    const newNodeId = uuidv4();
    const sourceNode = nodes.find((node: { id: string; }) => node.id === sourceId);
    const newPosition = sourceNode
      ? { x: sourceNode.position.x, y: relation === 'parent' ? sourceNode.position.y  - 200 : sourceNode.position.y  + 200}
      : { x: 0, y: 0 };

    const newNode = {
      id: newNodeId,
      position: newPosition,
      data: { firstName, secondName, sex, dateOfBirth },
      type: 'custom',
    };

    let edgeSource, edgeTarget;
    if (relation === 'parent') {
      edgeSource = newNodeId;
      edgeTarget = sourceId;
    } else if (relation === 'child') {
      edgeSource = sourceId;
      edgeTarget = newNodeId;
    } else {
      throw new Error('Недопустимый тип отношения');
    }

    const newEdgeId = uuidv4();
    const newEdge = { id: newEdgeId, source: edgeSource, target: edgeTarget };

    setNodes((nds: any) => [...nds, newNode]);
    setEdges((eds: any) => [...eds, newEdge]);
  };

  // Новая функция для изменения пользователя
  const editMember = (id: string, firstName: string, secondName: string, sex: string, dateOfBirth: Date) => {
    setNodes((nds: any[]) =>
      nds.map((node: { id: string; data: any; }) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              firstName,
              secondName,
              sex,
              dateOfBirth,
            },
          };
        }
        return node;
      })
    );
  };

  const deleteMember = (id: string) => {
    setNodes((nds: any[]) => nds.filter((node: { id: string; }) => node.id !== id));
    setEdges((eds: any[]) => eds.filter((edge: { source: string; target: string; }) => edge.source !== id && edge.target !== id));
  };

  useEffect(() => {
    localStorage.setItem('nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('edges', JSON.stringify(edges));
  }, [edges]);

  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        addNewMember,
        editMember,   
        deleteMember, 
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};