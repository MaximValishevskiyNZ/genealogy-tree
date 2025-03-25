import { useContext } from 'react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowProvider, FlowContext } from './context';
import { FamilyMemberNodeUI } from './components/FamilyMember/FamilyMemberNode';
import { SearchComponent } from './components/SearchComponent/SearchComponent';


const FlowComponent = () => {
  const { nodes, edges, onNodesChange, onEdgesChange} = useContext(FlowContext);

  return (
    <div>
         <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          custom: FamilyMemberNodeUI,
        }}
      />
    </div>
    <SearchComponent />
    </div>
  );
};

export default function App() {
  return (
    <FlowProvider>
      <FlowComponent />
    </FlowProvider>
  );
}