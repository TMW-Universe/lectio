import { createContext, useContext, useState } from "react";
import {
  ReaderSettings,
  getLocalStoredReaderSettings,
} from "../../hooks/reader/settings/use-reader-settings";

const READER_SETTINGS_CONTEXT = createContext<{
  readerSettings: ReaderSettings;
  setReaderSettings: (readerSettings: ReaderSettings) => void;
} | null>(null);

type Props = {
  children: JSX.Element;
};

export default function ReaderSettingsProvider({ children }: Props) {
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(
    getLocalStoredReaderSettings()
  );

  return (
    <READER_SETTINGS_CONTEXT.Provider
      value={{
        readerSettings,
        setReaderSettings,
      }}
    >
      {children}
    </READER_SETTINGS_CONTEXT.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReaderSettingsProvider() {
  const context = useContext(READER_SETTINGS_CONTEXT);

  if (!context) throw new Error("Missing READER SETTINGS context");

  return context;
}
