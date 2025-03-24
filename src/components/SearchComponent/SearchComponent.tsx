import { FormEvent, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useContext, useState } from "react";
import { FlowContext } from "../../context";
import styles from './SearchComponent.module.css'
import Fuse from 'fuse.js'

export function SearchComponent()  {
    const { nodes } = useContext(FlowContext);
    const [ inputValue, setInputValue ] = useState('')
    const [ searchResults, setSearchResults ] = useState('')
  
    function handleInput(event: FormEvent<HTMLInputElement>): void {
        const query = event.target.value;
        setInputValue(query);
        const fuse = new Fuse(nodes, {
            keys: ['data.firstName', 'data.secondName'],
            threshold: 0.3,
          });
      
          const results = fuse.search(query).map(result => result.item);
          setSearchResults(results);
    }

    return (
        <div className={styles.searchComponent}>
      <input
        type="text"
        value={inputValue}
        onInput={handleInput}
        placeholder="Поиск"
      />
      {searchResults && (
        <ul>
          {searchResults.map((node: { id: Key | null | undefined; data: { firstName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; secondName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; }) => (
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
    )
}