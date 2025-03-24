import { useContext } from "react";
import styles from "../../uiComponents.module.css";
import { FlowContext } from "../../../context";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { IoSaveOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

const validationSchema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  secondName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  sex: z.enum(["M", "F"], { message: "Пол должен быть M или F" }),
  dateOfBirth: z.date({ required_error: "Дата рождения обязательна" }),
  relation: z.enum(["parent", "child"], {
    message: "Отношение должно быть parent или child",
  }),
});

export function AddNewForm({ changeFormPopUp, id }) {
  const { addNewMember } = useContext(FlowContext);

  const form = useForm({
    defaultValues: {
      firstName: "",
      secondName: "",
      sex: "M",
      dateOfBirth: new Date(),
      relation: "child",
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: ({ value }) => {
      addNewMember(
        id,
        value.firstName,
        value.secondName,
        value.sex,
        value.dateOfBirth,
        value.relation
      );
    },
  });

  return (
    <div className={styles.popup}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {form.Field({
          name: "firstName",
          children: (field) => (
            <div>
              <label className={styles.label} htmlFor={field.name}>Имя</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.value && field.state.meta.errors ? (
               <em className={styles.error}>
                  {field.state.meta.errors
                    .map((error) => error.message)
                    .join(", ")}
                </em>
              ) : null}
            </div>
          ),
        })}
        {form.Field({
          name: "secondName",
          children: (field) => (
            <div>
              <label className={styles.label} htmlFor={field.name}>Фамилия</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.value && field.state.meta.errors ? (
                <em className={styles.error}>
                  {field.state.meta.errors
                    .map((error) => error.message)
                    .join(", ")}
                </em>
              ) : null}
            </div>
          ),
        })}
        {form.Field({
          name: "sex",
          children: (field) => (
            <div>
              <label className={styles.label} htmlFor={field.name}>Пол</label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="M">Мужской</option>
                <option value="F">Женский</option>
              </select>
              {field.state.value && field.state.meta.errors ? (
               <em className={styles.error}>
                  {field.state.meta.errors
                    .map((error) => error.message)
                    .join(", ")}
                </em>
              ) : null}
            </div>
          ),
        })}
        {form.Field({
          name: "dateOfBirth",
          children: (field) => (
            <div>
              <label className={styles.label} htmlFor={field.name}>Дата рождения</label>
              <input
                type="date"
                id={field.name}
                name={field.name}
                value={field.state.value.toISOString().split("T")[0]}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(new Date(e.target.value))}
              />
              {field.state.value && field.state.meta.errors ? (
               <em className={styles.error}>
                  {field.state.meta.errors
                    .map((error) => error.message)
                    .join(", ")}
                </em>
              ) : null}
            </div>
          ),
        })}
        {form.Field({
          name: "relation",
          children: (field) => (
            <div>
              <label className={styles.label} htmlFor={field.name}>Отношение</label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="child">Ребёнок</option>
                <option value="parent">Родитель</option>
              </select>
              {field.state.value && field.state.meta.errors ? (
               <em className={styles.error}>
                  {field.state.meta.errors
                    .map((error) => error.message)
                    .join(", ")}
                </em>
              ) : null}
            </div>
          ),
        })}
        <div className={styles.buttons}>
        <button className={styles.button} type="submit"><IoSaveOutline /></button>
        <button className={styles.button} onClick={changeFormPopUp}><RxCross1 /></button>
        </div>
      </form>
    </div>
  );
}
