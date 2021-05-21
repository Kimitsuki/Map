import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';

let { height, width } = Dimensions.get('window');

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <View style={{ height: height, width: width, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent={true} />
                <TouchableOpacity onPress={() => this.props.navigation.navigate('MainPage', { item: {} })}>
                    <Image source={require('../pictures/loading.png')} style={{ width: 200, height: 200 }} />
                </TouchableOpacity>
            </View>
        )
    }
}