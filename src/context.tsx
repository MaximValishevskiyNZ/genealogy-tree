import { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Edge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { FamilyMemberNodeData } from './components/FamilyMember/FamilyMemberNode';

const initialNodes: FamilyMemberNodeData[] = [
  { id: '1', position: { x: 300, y: 300 }, data: { sex: 'M', firstName: 'Иван', secondName: 'Иванов',  dateOfBirth: new Date(), root: true }, type: 'custom' },
];

const loadNodes = (): FamilyMemberNodeData[] => {
  const saved = localStorage.getItem('nodes');
  if (saved) {
    const nodes = JSON.parse(saved);
    return nodes.map((node: FamilyMemberNodeData) => ({
      ...node,
      data: { ...node.data, dateOfBirth: new Date(node.data.dateOfBirth) },
    }));
  }
  return initialNodes;
};

const loadEdges = (): Edge[] => {
  const saved = localStorage.getItem('edges');
  return saved ? JSON.parse(saved) : [];
};

interface FlowContextType {
  nodes: FamilyMemberNodeData[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNewMember: (sourceId: string, firstName: string, secondName: string, sex: "M" | "F", dateOfBirth: Date, relation: 'parent' | 'child') => void;
  editMember: (id: string, firstName: string, secondName: string, sex: "M" | "F", dateOfBirth: Date) => void;
  deleteMember: (id: string) => void;
}

const defaultContextValue: FlowContextType = {
  nodes: [],
  edges: [],
  onNodesChange: () => {},
  onEdgesChange: () => {},
  addNewMember: () => {},
  editMember: () => {},
  deleteMember: () => {},
};

export const FlowContext = createContext<FlowContextType>(defaultContextValue);

export const FlowProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<FamilyMemberNodeData[]>(loadNodes);
  const [edges, setEdges] = useState<Edge[]>(loadEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: FamilyMemberNodeData[]) =>
        applyNodeChanges(changes, nds) as FamilyMemberNodeData[]
      ),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const addNewMember = (
    sourceId: string,
    firstName: string,
    secondName: string,
    sex: "M" | "F",
    dateOfBirth: Date,
    relation: 'parent' | 'child'
  ) => {
    const newNodeId = uuidv4();
    const sourceNode = nodes.find((node) => node.id === sourceId);
    const newPosition = sourceNode
      ? { x: sourceNode.position.x, y: relation === 'parent' ? sourceNode.position.y - 200 : sourceNode.position.y + 200 }
      : { x: 0, y: 0 };

    const newNode: FamilyMemberNodeData = {
      id: newNodeId,
      position: newPosition,
      data: { firstName, secondName, sex, dateOfBirth },
      type: 'custom',
    };

    let edgeSource: string, edgeTarget: string;
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
    const newEdge: Edge = { id: newEdgeId, source: edgeSource, target: edgeTarget };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  const editMember = (id: string, firstName: string, secondName: string, sex: "M" | "F", dateOfBirth: Date) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, firstName, secondName, sex, dateOfBirth },
          };
        }
        return node;
      })
    );
  };

  const deleteMember = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
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