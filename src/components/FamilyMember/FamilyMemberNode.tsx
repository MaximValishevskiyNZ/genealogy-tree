import { Handle, Node, NodeProps, Position, XYPosition } from "@xyflow/react";
import styles from "./FamilyMemberNodeUI.module.css"; 
import { FlowContext } from "../../context";
import { useContext, useState } from "react";
import { AddNewForm } from "./AddNewForm/AddNewForm";
import stylesUI from "../uiComponents.module.css"
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { EditForm } from "./EditForm/EditForm";

export type FamilyMemberNodeData = Node<{
    sex: "M" | "F";
    firstName: string;
    secondName: string;
    dateOfBirth: Date;
    root?: boolean
}>;

export function FamilyMemberNodeUI(props: NodeProps<FamilyMemberNodeData>) {
    const { deleteMember } = useContext(FlowContext);
    const [formOpen, setFormOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    const changeFormPopUp = () => {
        setFormOpen(!formOpen)
    }

    const changeEditPopUp = () => {
        setEditOpen(!editOpen)
    }

    const genderClass = props.data.sex === "M" ? styles.male : styles.female;

    return (
        <div className={`${styles.nodeContainer} ${genderClass}`}>
            <Handle type="target" position={Position.Top} className={styles.handle} />
            <div className={styles.name}>
                {props.data.sex === "M" ? "♂" : "♀"} {props.data.firstName} {props.data.secondName}
            </div>
            <div className={styles.birthDate}>
                {props.data.dateOfBirth ? props.data.dateOfBirth.toLocaleDateString() : ''}
            </div>
            <div className={stylesUI.buttons}>
                <button className={stylesUI.button} onClick={changeFormPopUp}><FaPlus /></button>
                <button className={stylesUI.button} onClick={changeEditPopUp}><FiEdit /></button>
                {!props.data.root && <button className={stylesUI.button} onClick={() => deleteMember(props.id)}><MdOutlineDelete /></button>}
            </div>
            <Handle type="source" position={Position.Bottom} className={styles.handle} />
            {formOpen && <AddNewForm changeFormPopUp={changeFormPopUp} id={props.id}/>}
            {editOpen && <EditForm changeEditPopUp={changeEditPopUp} id={props.id} data={props.data}/>}
        </div>
    );
}