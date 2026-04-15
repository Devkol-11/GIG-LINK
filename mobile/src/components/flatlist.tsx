import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';

const flatListComponent = () => {
     const list = [
          { name: 'F1', age: 20 },
          { name: 'F2', age: 30 },
          { name: 'F3', age: 40 },
          { name: 'F4', age: 50 },
          { name: 'F5', age: 60 }
     ];

     return (
          <view>
               <FlatList
                    data={list}
                    keyExtractor={(list) => list.name}
                    renderItem={({ item }) => (
                         <Text style={styleSheet.textStyle}>
                              {item.name} - AGE {item.age}
                         </Text>
                    )}
               />
          </view>
     );
};

const styleSheet = StyleSheet.create({
     textStyle: {
          marginVertical: 70
     }
});
