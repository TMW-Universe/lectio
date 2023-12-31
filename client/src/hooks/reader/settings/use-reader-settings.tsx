import { InferType, number, object } from "yup";
import { useReaderSettingsProvider } from "../../../providers/reader/reader-settings.provider";

const READER_SETTINGS_LS_KEY = "reader-settings";
const READER_DEFAULT_SETTINGS = {
  imagesSize: 100,
};
const READER_SETTINGS_SCHEMA = object({
  imagesSize: number().required().default(READER_DEFAULT_SETTINGS.imagesSize),
});

export type ReaderSettings = InferType<typeof READER_SETTINGS_SCHEMA>;

export const getLocalStoredReaderSettings = (): ReaderSettings => {
  try {
    const jsonSettings = localStorage.getItem(READER_SETTINGS_LS_KEY);
    if (!jsonSettings) return READER_DEFAULT_SETTINGS;
    return READER_SETTINGS_SCHEMA.cast(JSON.parse(jsonSettings));
  } catch (e) {
    localStorage.removeItem(READER_SETTINGS_LS_KEY);
    return READER_DEFAULT_SETTINGS;
  }
};

export function useReaderSettings() {
  const { readerSettings, setReaderSettings } = useReaderSettingsProvider();

  return {
    readerSettings,
    setReaderSettings: (settings: ReaderSettings) => {
      localStorage.setItem(READER_SETTINGS_LS_KEY, JSON.stringify(settings));
      setReaderSettings(settings);
    },
  };
}
