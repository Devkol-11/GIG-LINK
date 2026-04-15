import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const { themeColors } = useTheme();
     return (
          <View
               style={[
                    styles.card,
                    {
                         backgroundColor: themeColors.background,
                         borderColor: themeColors.border
                    }
               ]}
          >
               {children}
          </View>
     );
};

const styles = StyleSheet.create({
     card: {
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          marginVertical: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2
     }
});
