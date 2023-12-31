import { Language } from "@tmw-universe/tmw-universe-types";
import { CSSProperties } from "react";

// Images
import es_ES from "../../../assets/flags/rounded/es.png";
import en_US from "../../../assets/flags/rounded/usa.png";

const obj = {
  [Language.en_US]: en_US,
  [Language.es_ES]: es_ES,
};

type Props = {
  language: Language;
  style?: CSSProperties;
  className?: string;
};

export default function LanguageFlag({ language, style, className }: Props) {
  return (
    <img
      className={className}
      style={style}
      src={obj[language]}
      alt={`${language} flag`}
      aria-description={`The flag representing the language ${language}`}
    />
  );
}
