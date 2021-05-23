import React, { Component } from 'react';
import { Text, Dimensions, View, ScrollView, Linking, TouchableOpacity, FlatList, Image, AsyncStorage } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../StyleSheet';
import { Filter } from '../function/Filter';
import { FetchData } from '../function/FetchData';
import { NavigationEvents } from 'react-navigation';

let { height, width } = Dimensions.get('window');

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGas: true,
            listATM: false,
            isLoading: true,
            dataSource: [],
            filter: ' ',
            refresh: true,
            favorites: [],
        }
    }
    async componentDidMount() {
        FetchData.data().then(res => {
            this.setState({
                isLoading: false,
                dataSource: res,
            })
        })
    }
    renderHeart(item) {
        if (!this.state.favorites.some((x) => x.id === item.id)) {
            return (
                <Image source={require('../pictures/bookmark.png')} style={{ width: 30, height: 30 }} />
            )
        } else {
            return (
                <Image source={require('../pictures/bookmarked.png')} style={{ width: 30, height: 30 }} />
            )
        }
    }
    async updateList() {
        const response = await AsyncStorage.getItem('favorites');
        const listOfLikes = await JSON.parse(response) || [];
        this.setState({
            refresh: !this.state.refresh,
            favorites: listOfLikes
        });
    }
    async addToFavorites(item) {
        const listOfHouses = [...this.state.favorites, item];
        await AsyncStorage.setItem('favorites',
            JSON.stringify(listOfHouses));
        this.setState({
            refresh: !this.state.refresh,
            favorites: listOfHouses,
        });
    }
    async removeToFavorites(item) {
        const value = this.state.favorites.filter(x => x.id != item.id);
        await AsyncStorage.setItem('favorites',
            JSON.stringify(value));
        this.setState({
            refresh: !this.state.refresh,
            favorites: value,
        });
    }
    onPressHeartButton(item) {
        if (!this.state.favorites.some((x) => x.id === item.id)) {
            this.addToFavorites(item);
        } else {
            this.removeToFavorites(item);
        }
    }
    onFocus = async () => {
        const response = await AsyncStorage.getItem('favorites');
        const listOfLikes = await JSON.parse(response) || [];
        this.setState({
            refresh: !this.state.refresh,
            favorites: listOfLikes,
        });
        console.log(this.state.favorites);
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <NavigationEvents
                    onWillFocus={this.onFocus} />
                <View style={styles.headerBackground}>
                    <Text style={styles.bigWhite}>Danh sách</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 30, width: 100 }}>
                        {this.state.listGas ?
                            <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({ listGas: false })}>
                                <View style={styles.circle}></View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({ listGas: true, listATM: false, filter: ' ', refresh: !this.state.refresh })} />
                        }
                        <Text style={{ color: '#5ec3f2' }}>  Trạm xăng</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 30, width: 100 }}>
                        {this.state.listATM ?
                            <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({ listATM: false })}>
                                <View style={styles.circle}></View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({ listATM: true, listGas: false, filter: ' ', refresh: !this.state.refresh })} />
                        }
                        <Text style={{ color: '#5ec3f2' }}>  ATM</Text>
                    </View>
                </View>
                <View style={{ width: '100%', padding: 20 }}>
                    <View style={{ height: 40, width: '100%', backgroundColor: '#eff2f5', borderRadius: 5, justifyContent: 'center' }}>
                        {this.state.listGas ?
                            <Picker
                                style={{ height: 40, width: '100%' }}
                                onValueChange={(itemValue) => this.setState({ filter: itemValue, refresh: !this.state.refresh })}
                            >
                                <Picker.Item label='Tất cả' value=' ' />
                                <Picker.Item label='Petrolimex' value='Petrolimex' />
                                <Picker.Item label='Mipec' value='Mipec' />
                                <Picker.Item label='Redriver' value='Redriver' />
                            </Picker> : <View />
                        }
                        {this.state.listATM ?
                            <Picker
                                style={{ height: 40, width: '100%' }}
                                onValueChange={(itemValue) => this.setState({ filter: itemValue, refresh: !this.state.refresh })}
                            >
                                <Picker.Item label='Tất cả' value=' ' />
                                <Picker.Item label='Agribank' value='Agribank' />
                                <Picker.Item label='BIDV' value='BIDV' />
                                <Picker.Item label='Vietcombank' value='Vietcombank' />
                                <Picker.Item label='Vietinbank' value='Vietinbank' />
                                <Picker.Item label='TP' value='TP' />
                                <Picker.Item label='MB' value='MB' />
                                <Picker.Item label='VIB' value='VIB' />
                                <Picker.Item label='ACB' value='ACB' />
                                <Picker.Item label='MSB' value='MSB' />
                                <Picker.Item label='PG' value='PG' />
                                <Picker.Item label='SHB' value='SHB' />
                                <Picker.Item label='Sacombank' value='Sacombank' />
                                <Picker.Item label='AB' value='AB' />
                                <Picker.Item label='SeABank' value='SeABank' />
                                <Picker.Item label='SaiGonBank' value='SaiGonBank' />
                                <Picker.Item label='PublicBank' value='PublicBank' />
                                <Picker.Item label='HSBC' value='HSBC' />
                                <Picker.Item label='HDBank' value='HDBank' />
                                <Picker.Item label='Eximbank' value='Eximbank' />
                                <Picker.Item label='PVCombank' value='PVCombank' />
                                <Picker.Item label='OceanBank' value='OceanBank' />
                                <Picker.Item label='VietBank' value='VietBank' />
                                <Picker.Item label='VietABank' value='VietABank' />
                                <Picker.Item label='GPBank' value='GPBank' />
                                <Picker.Item label='Techcombank' value='Techcombank' />
                            </Picker> : <View />
                        }
                    </View>
                </View >
                {
                    this.state.listGas ?
                        <ScrollView style={styles.list}>
                            <FlatList
                                data={this.state.dataSource}
                                renderItem={({ item }) => {
                                    return (
                                        <View>{item.types == 'gas' && Filter({ services: item.services, check: this.state.filter }) ?
                                            <View style={{ padding: 5 }}>
                                                <TouchableOpacity style={{ padding: 5, borderColor: '#5ec3f2', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', justifyContent: 'space-around' }} onPress={() => this.props.navigation.navigate('MapList', { item: item })}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Image source={require('../pictures/gas.png')} style={{ width: 70, height: 70 }} />
                                                        <View style={{ padding: 5, flex: 7 }}>
                                                            <Text style={styles.infoName}>{item.name}</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ paddingTop: 5, width: 12, alignItems: 'center' }}>
                                                                    <Image source={require('../pictures/address.png')} style={{ width: 8, height: 12 }} />
                                                                </View>
                                                                <Text style={styles.infoAddress}> {item.address}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ paddingTop: 5 }}>
                                                                    <Image source={require('../pictures/service.png')} style={{ width: 12, height: 12 }} />
                                                                </View>
                                                                <Text style={styles.infoAddress}> {item.services}</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <TouchableOpacity style={{ flex: 1 }} onPress={this.onPressHeartButton.bind(this, item)}>
                                                                {this.renderHeart(item)}
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => Linking.openURL('google.navigation:q=' + item.latitude + '+' + item.longitude)}>
                                                                <Image source={require('../pictures/gps.png')} style={{ width: 30, height: 30 }} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity >
                                            </View>
                                            :
                                            <View />
                                        }
                                        </View>
                                    )
                                }}
                                extraData={this.state.refresh}
                            />
                        </ScrollView> : <View />
                }
                {
                    this.state.listATM ?
                        <ScrollView style={styles.list}>
                            <FlatList
                                data={this.state.dataSource}
                                renderItem={({ item }) => {
                                    return (
                                        <View>{item.types == 'ATM' && Filter({ services: item.services, check: this.state.filter }) ?
                                            <View style={{ padding: 5 }}>
                                                <TouchableOpacity style={{ padding: 5, borderColor: '#5ec3f2', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', justifyContent: 'space-around' }} onPress={() => this.props.navigation.navigate('MapList', { item: item })}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: 70, alignItems: 'center' }}>
                                                            <Image source={require('../pictures/atm.png')} style={{ width: 50, height: 70 }} />
                                                        </View>
                                                        <View style={{ padding: 5, flex: 7 }}>
                                                            <Text style={styles.infoName}>{item.name}</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ paddingTop: 5, width: 12, alignItems: 'center' }}>
                                                                    <Image source={require('../pictures/address.png')} style={{ width: 8, height: 12 }} />
                                                                </View>
                                                                <Text style={styles.infoAddress}> {item.address}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ paddingTop: 5 }}>
                                                                    <Image source={require('../pictures/service.png')} style={{ width: 12, height: 12 }} />
                                                                </View>
                                                                <Text style={styles.infoAddress}> {item.services}</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <TouchableOpacity style={{ flex: 1 }} onPress={this.onPressHeartButton.bind(this, item)}>
                                                                {this.renderHeart(item)}
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => Linking.openURL('google.navigation:q=' + item.latitude + '+' + item.longitude)}>
                                                                <Image source={require('../pictures/gps.png')} style={{ width: 30, height: 30 }} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity >
                                            </View>
                                            :
                                            <View />
                                        }
                                        </View>
                                    )
                                }}
                                extraData={this.state.refresh}
                            />
                        </ScrollView> : <View />
                }
            </View >
        );
    }
}