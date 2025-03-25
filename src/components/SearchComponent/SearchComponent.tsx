import { ChangeEvent, useContext, useState } from "react";
import { FlowContext } from "../../context";
import styles from './SearchComponent.module.css';
import Fuse from 'fuse.js';

interface Node {
  id: string;
  data: {
    firstName: string;
    secondName: string;
  };
}

export function SearchComponent() {
  const { nodes } = useContext(FlowContext);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<Node[]>([]);

  function handleInput(event: ChangeEvent<HTMLInputElement>): void {
    const query = event.target.value;
    setInputValue(query);

    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      const fuse = new Fuse(nodes, {
        keys: ['data.firstName', 'data.secondName'],
        threshold: 0.3,
      });
      const results = fuse.search(query).map(result => result.item);
      setSearchResults(results);
    }
  }

  return (
    <div className={styles.searchComponent}>
      <input
        type="text"
        value={inputValue}
        onInput={handleInput}
        placeholder="Поиск"
      />
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((node: Node) => (
            <li key={node.id}>
              {node.data.firstName} {node.data.secondName}
            </li>
          ))}
        </ul>
      )}
      {inputValue && searchResults.length === 0 && (
        <p>Ничего не найдено</p>
      )}
    </div>
  );
}