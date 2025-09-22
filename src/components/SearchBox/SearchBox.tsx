import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      defaultValue={value}
      onChange={onChange}
      type="text"
      placeholder="Search posts"
    />
  );
}
