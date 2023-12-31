import { red } from "@ant-design/colors";
import { Theme } from "@tmw-universe/tmw-universe-types";
import { ConfigProvider, theme as antdTheme } from "antd";
import { createContext, useContext, useState } from "react";

type Props = {
  children: JSX.Element;
};

export interface ThemeContextType {
  primaryColor: string;
  theme: Theme;
}

const ThemeContext = createContext<{
  theme: Partial<ThemeContextType>;
  setTheme: (theme: Partial<ThemeContextType>) => void;
} | null>(null);

const DEFAULT_THEME: ThemeContextType = {
  primaryColor: red[6],
  theme: Theme.LIGHT,
};

export default function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Partial<ThemeContextType>>(DEFAULT_THEME);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.primaryColor,
          },
          algorithm:
            theme.theme === Theme.DARK ? antdTheme.darkAlgorithm : undefined,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("No Theme context detected");

  return context;
}
