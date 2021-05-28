import React, { Component } from 'react';
import { Text, Dimensions, View, Image, StatusBar, Linking, TouchableOpacity, BackHandler } from 'react-native';
import { styles } from '../StyleSheet'

let { height, width } = Dimensions.get('window');

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            distance: this.props.navigation.state.params.distance,
            duration: this.props.navigation.state.params.duration,
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    }
    render() {
        const openURL = (email) => {
            if (email.includes('http')) {
                Linking.openURL(email)
            } else {
                Linking.openURL('mailto:' + email)
            }
        }
        return (
            <View style={{ height: '100%', backgroundColor: 'white' }}>
                <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent={true} />
                <View style={styles.headerBackground}>
                    <TouchableOpacity style={{ marginTop: 30, marginLeft: 20 }} onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../pictures/back_white.png')} style={{ width: 15, height: 30 }} />
                    </TouchableOpacity>
                    <Text style={styles.bigWhite}>Chi tiết</Text>
                </View>
                <View style={{ alignSelf: 'center' }}>
                    {this.state.item.types == 'gas' ?
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/gas_info_1.jpg')} style={{ width: width * 2 / 3, height: 150 }} />
                            <Image source={require('../pictures/gas_info_2.jpg')} style={{ width: width / 3, height: 150 }} />
                        </View>
                        : this.state.item.types == 'ATM' ?
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../pictures/atm_info_1.jpg')} style={{ width: width / 3, height: 150 }} />
                                <Image source={require('../pictures/atm_info_2.jpg')} style={{ width: width * 2 / 3, height: 150 }} />
                            </View>
                            : <View />}
                </View>
                <View style={{ marginTop: 20, paddingLeft: 10, paddingRight: 55 }}>
                    <Text style={styles.bigInfoName}>{this.state.item.name}</Text>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                        <Text style={styles.bigBoldInfoAddress}>Địa chỉ:</Text>
                        <Text style={styles.bigInfoAddress}> {this.state.item.address}</Text>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                        <Text style={styles.bigBoldInfoAddress}>Giờ mở cửa:</Text>
                        <Text style={styles.bigInfoAddress}> {this.state.item.open_close}</Text>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                        <Text style={styles.bigBoldInfoAddress}>Dịch vụ:</Text>
                        <Text style={styles.bigInfoAddress}> {this.state.item.services}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/distance.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ color: 'black' }}> {this.state.distance}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/duration.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ color: 'black' }}>  {this.state.duration}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{ alignSelf: 'center', borderBottomWidth: 2, width: width * 2 / 3, marginTop: 10 }}></View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Image source={require('../pictures/phone.png')} style={{ width: 25, height: 25 }} />
                            <Text>  </Text>
                            <Text style={{ alignSelf: 'center', color: 'black', textDecorationLine: 'underline' }} onPress={() => { Linking.openURL('tel:' + this.state.item.phone); }}>{this.state.item.phone}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Image source={require('../pictures/email.png')} style={{ width: 25, height: 25 }} />
                            <Text>  </Text>
                            <Text style={{ alignSelf: 'center', color: 'black', textDecorationLine: 'underline' }} onPress={() => { openURL(this.state.item.email) }}>{this.state.item.email}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}