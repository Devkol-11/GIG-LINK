import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface Props {
     uri: string;
     size?: number;
}

export const Avatar: React.FC<Props> = ({ uri, size = 50 }) => {
     return (
          <View
               style={[
                    styles.container,
                    {
                         width: size,
                         height: size,
                         borderRadius: size / 2
                    }
               ]}
          >
               <Image
                    source={{ uri }}
                    style={{
                         width: size,
                         height: size,
                         borderRadius: size / 2
                    }}
               />
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          overflow: 'hidden'
     }
});
