import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { colors } from './tokens';

type ThemeMode = 'light' | 'dark';

// Define a type that extends the base colors with background and text
type ThemeColors = typeof colors & {
        background: string;
        text: string;
};

interface ThemeContextType {
        mode: ThemeMode;
        toggleMode: () => void;
        themeColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
        mode: 'light',
        toggleMode: () => {},
        themeColors: {
                ...colors,
                background: colors.backgroundLight,
                text: colors.textLight
        }
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
        children
}) => {
        const [mode, setMode] = useState<ThemeMode>('light');

        useEffect(() => {
                const init = async () => {
                        const stored = await SecureStore.getItemAsync('theme');
                        if (stored) setMode(stored as ThemeMode);
                        else setMode(Appearance.getColorScheme() || 'light');
                };
                init();
        }, []);

        const toggleMode = async () => {
                const newMode = mode === 'light' ? 'dark' : 'light';
                setMode(newMode);
                await SecureStore.setItemAsync('theme', newMode);
        };

        const themeColors: ThemeColors =
                mode === 'light'
                        ? {
                                  ...colors,
                                  background: colors.backgroundLight,
                                  text: colors.textLight
                          }
                        : {
                                  ...colors,
                                  background: colors.backgroundDark,
                                  text: colors.textDark
                          };

        return (
                <ThemeContext.Provider
                        value={{ mode, toggleMode, themeColors }}
                >
                        {children}
                </ThemeContext.Provider>
        );
};

export const useTheme = () => useContext(ThemeContext);
