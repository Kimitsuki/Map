import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { styles } from '../StyleSheet';

export const History = ({ fun, item }) => {
    return (
        <View>
            <TouchableOpacity
                onPress={fun}
                style={styles.historyBox}
            >
                <Image source={require('../pictures/history.png')} style={{ width: 20, height: 20 }} />
                <View>
                    <Text style={styles.name}> {item}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}