import React from 'react';
import { TextInput, StyleSheet, FlatList } from 'react-native';
import { useTheme } from 'theme/ThemeProvider';

interface Props {
     value: string;
     onChangeText: (text: string) => void;
     placeholder?: string;
     secureTextEntry?: boolean;
}

export const AppInput: React.FC<Props> = ({
     value,
     onChangeText,
     placeholder,
     secureTextEntry
}) => {
     const { themeColors } = useTheme();

     return (
          <view>
               <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={themeColors.border}
                    style={[
                         styles.input,
                         {
                              backgroundColor: themeColors.background,
                              color: themeColors.text,
                              borderColor: themeColors.border
                         }
                    ]}
               />
          </view>
     );
};

const styles = StyleSheet.create({
     input: {
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          marginVertical: 6
     }
});
