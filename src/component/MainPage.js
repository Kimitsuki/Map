import React, { Component } from 'react';
import { Text, TextInput, View, Image, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { styles } from '../StyleSheet';
import { Item } from '../function/RenderItem';
import Geolocation from '@react-native-community/geolocation';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchLog } from '../function/SearchLog';
import { GetLog } from '../function/GetLog';
import { FetchData } from '../function/FetchData';
import { History } from '../function/RenderHistory';

let { height, width } = Dimensions.get('window');

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            direct: [],
            item: {},
            latitude: 0,
            longitude: 0,
            regionLatitude: 0,
            regionLongitude: 0,
            regionLatitudeDelta: 0.05,
            regionLongitudeDelta: 0.05,
            currentPositionLatitude: 0,
            currentPositionLongitude: 0,
            search: '',
            location: true,
            isFocus: false,
            refresh: true,
            direct: false,
            history: '',
        }
    }
    async componentDidMount() {
        this.currentPosition();
        this.getLog();
        FetchData.data().then(res => {
            this.setState({
                isLoading: false,
                dataSource: res,
            })
        })
    }
    currentPosition() {
        Geolocation.getCurrentPosition(
            (info) => this.getPosition(info.coords.latitude, info.coords.longitude),
            (error) => console.log(error),
            { enableHighAccuracy: false, timeout: 50000 }
        );
    }
    getPosition(latitude, longitude) {
        this.setState({
            currentPositionLatitude: latitude,
            currentPositionLongitude: longitude,
            regionLatitude: latitude,
            regionLongitude: longitude
        })
    }
    updatePosition(item) {
        SearchLog({ name: item.name })
        this.setState({
            item: item,
            latitude: item.latitude,
            longitude: item.longitude,
            regionLatitude: item.latitude,
            regionLongitude: item.longitude,
        })
        this.clear();
    }
    updateSearch = (search) => {
        this.setState({
            search,
            refresh: !this.state.refresh
        })
    }
    getLog() {
        GetLog.log().then(res => {
            this.setState({
                history: res,
            })
        })
    }
    clear() {
        this.setState({
            isFocus: false,
            info: false,
            direct: false,
        })
        this.getLog();
        Keyboard.dismiss();
    }
    render() {
        const { search } = this.state
        const onFocus = () => this.setState({ isFocus: true })
        if (this.state.isLoading) {
            return (
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent={true} />
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: this.state.regionLatitude,
                        longitude: this.state.regionLongitude,
                        latitudeDelta: this.state.regionLatitudeDelta,
                        longitudeDelta: this.state.regionLongitudeDelta
                    }}
                    onRegionChangeComplete={(region) => {
                        this.setState({
                            regionLatitude: region.latitude,
                            regionLongitude: region.longitude,
                            regionLatitudeDelta: region.latitudeDelta,
                            regionLongitudeDelta: region.longitudeDelta
                        })
                    }}
                    onPress={() => { this.clear() }}
                >
                    {this.state.location ?
                        <Marker coordinate={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }} pinColor='#5ec3f2' title='Vị trí của bạn'
                            onPress={() => this.clear()} /> : <View />}
                    {this.state.latitude != 0 && this.state.longitude != 0 ?
                        <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                            onPress={() => { this.setState({ info: true, direct: true }), this.getLog(); }} /> : <View />}
                    {this.state.direct ?
                        <MapViewDirections
                            origin={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }}
                            destination={{ latitude: this.state.item.latitude, longitude: this.state.item.longitude }}
                            apikey={'AIzaSyDGRIkhrfyhXfwmzRRX6TTyZ6XmvAsW4Iw&fbclid'}
                            strokeWidth={3}
                            strokeColor="hotpink"
                        /> : <View />}
                </MapView>
                <View style={styles.findingBox}>
                    <Image source={require('../pictures/map.png')} style={{ width: 30, height: 30 }} />
                    <TextInput
                        style={{ width: width }}
                        placeholder='Tìm kiếm địa điểm'
                        onChangeText={this.updateSearch}
                        value={search}
                        maxLength={45}
                        onFocus={onFocus}
                    />
                </View>
                {this.state.isFocus ?
                    <ScrollView style={styles.listSearch} keyboardShouldPersistTaps='handled'>
                        {this.state.search == '' ?
                            <FlatList
                                keyboardShouldPersistTaps='handled'
                                data={this.state.history}
                                renderItem={({ item }) => <History fun={() => this.updateSearch(item)} item={item} />}
                                extraData={this.state.refresh}
                            />
                            :
                            <FlatList
                                keyboardShouldPersistTaps='handled'
                                data={this.state.dataSource}
                                renderItem={({ item }) => <Item fun={() => this.updatePosition(item)} item={item} check={this.state.search} currentLat={this.state.currentPositionLatitude} currentLon={this.state.currentPositionLongitude} />}
                                extraData={this.state.refresh}
                            />}
                    </ScrollView> : <View />}
                {this.state.info ?
                    <TouchableOpacity style={styles.info}>
                        <View style={{ flexDirection: 'row' }}>
                            {this.state.item.types == 'gas' ? <Image source={require('../pictures/gas.png')} style={{ width: 50, height: 50, marginTop: 5 }} />
                                : this.state.item.types == 'ATM' ? <Image source={require('../pictures/atm.png')} style={{ width: 50, height: 45, marginTop: 10 }} />
                                    : <View />}
                            <View style={{ paddingLeft: 10, paddingRight: 35 }}>
                                <Text style={styles.infoName}>{this.state.item.name}</Text>
                                <Text style={styles.infoAddress}>{this.state.item.address}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/open_close.png')} style={{ width: 25, height: 25 }} />
                            <Text>  </Text>
                            <Text style={{ alignSelf: 'center' }}>{this.state.item.open_close}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/services.png')} style={{ width: 25, height: 25 }} />
                            <Text>  </Text>
                            <Text style={{ alignSelf: 'center' }}>{this.state.item.services}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/phone.png')} style={{ width: 25, height: 25 }} />
                            <Text>  </Text>
                            <Text style={{ alignSelf: 'center' }}>{this.state.item.phone}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/email.png')} style={{ width: 25, height: 25 }} />
                            <Text>  </Text>
                            <Text style={{ alignSelf: 'center' }}>{this.state.item.email}</Text>
                        </View>
                    </TouchableOpacity> : <View />}
            </View>
        );
    }
}