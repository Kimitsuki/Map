import React, { Component } from 'react';
import { Text, View, Image, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator, Linking, BackHandler, AsyncStorage } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { styles } from '../StyleSheet';
import Geolocation from '@react-native-community/geolocation';

let { height, width } = Dimensions.get('window');

export default class MapList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            latitude: 0,
            longitude: 0,
            regionLatitude: 0,
            regionLongitude: 0,
            regionLatitudeDelta: 0.01,
            regionLongitudeDelta: 0.01,
            currentPositionLatitude: 0,
            currentPositionLongitude: 0,
            location: true,
            direct: false,
            oneInfo: false,
            distanceDriving: 0,
            distanceWalking: 0,
            driving: 0,
            walking: 0,
            fetching: false,
            mode: 'driving',
            favorites: [],
        }
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
        this.currentPosition();
        this.updateList();
        this.setState({
            regionLatitude: this.state.item.latitude,
            regionLongitude: this.state.item.longitude,
        })
    }
    fetchDistance(lat1, lon1, lat2, lon2) {
        let key = 'AIzaSyCOoszPDiUzYkmLt13L9Bxui0dUk7GAWvk';
        this.setState({ fetching: true })
        let urlDriving = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + lat1 + ',' + lon1 + '&destination=' + lat2 + ',' + lon2 + '&mode=driving&key=' + key;
        let urlWalking = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + lat1 + ',' + lon1 + '&destination=' + lat2 + ',' + lon2 + '&mode=walking&key=' + key;
        fetch(urlDriving)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({
                    distanceDriving: responseJSON.routes[0].legs[0].distance.text,
                    driving: responseJSON.routes[0].legs[0].duration.text,
                })
            })
        fetch(urlWalking)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({
                    distanceWalking: responseJSON.routes[0].legs[0].distance.text,
                    walking: responseJSON.routes[0].legs[0].duration.text,
                    fetching: false,
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
        })
    }
    clear() {
        this.setState({
            oneInfo: false,
        })
    }
    renderHeart(item) {
        //item: object
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
            favorites: listOfLikes
        });
    }
    async addToFavorites(item) {
        const listOfHouses = [...this.state.favorites, item];

        await AsyncStorage.setItem('favorites',
            JSON.stringify(listOfHouses));
        this.updateList();
    }
    async removeToFavorites(item) {
        const value = this.state.favorites.filter(x => x.id != item.id);
        await AsyncStorage.setItem('favorites',
            JSON.stringify(value));
        this.updateList();
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
            favorites: listOfLikes,
        });
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ height: '100%', justifyContent: 'center', backgroundColor: 'transparent' }}>
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
                    onRegionChangeComplete={region =>
                        this.setState({
                            regionLatitude: region.latitude,
                            regionLongitude: region.longitude,
                            regionLatitudeDelta: region.latitudeDelta,
                            regionLongitudeDelta: region.longitudeDelta
                        })
                    }
                    ref={ref => this.map = ref}
                    onPress={() => { this.clear() }}
                >
                    {this.state.location ?
                        <Marker coordinate={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }} pinColor='#5ec3f2' title='Vị trí của bạn'
                            onPress={() => this.clear()} identifier='mk1' /> : <View />
                    }
                    <Marker coordinate={{ latitude: this.state.item.latitude, longitude: this.state.item.longitude }}
                        onPress={() => { this.setState({ oneInfo: true }), this.fetchDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.item.latitude, this.state.item.longitude) }} identifier='mk2'
                    >
                        {this.state.item.types == 'gas' ? <Image source={require('../pictures/pointer_gas.png')} style={{ width: 40, height: 50 }} />
                            :
                            this.state.item.types == 'ATM' ? <Image source={require('../pictures/pointer_atm.png')} style={{ width: 40, height: 50 }} />
                                : <View />
                        }
                    </Marker>
                    {this.state.direct ?
                        <MapViewDirections
                            origin={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }}
                            destination={{ latitude: this.state.item.latitude, longitude: this.state.item.longitude }}
                            apikey={'AIzaSyCOoszPDiUzYkmLt13L9Bxui0dUk7GAWvk'}
                            strokeWidth={3}
                            strokeColor='#c84bc8'
                        />
                        : <View />
                    }
                </MapView>
                <TouchableOpacity style={{ position: 'absolute', width: 15, height: 30, marginTop: 30, marginLeft: 20 }} onPress={() => this.props.navigation.goBack()}>
                    <Image source={require('../pictures/back_black.png')} style={{ width: 15, height: 30 }} />
                </TouchableOpacity>
                {this.state.oneInfo ?
                    <View style={styles.info}>
                        {this.state.fetching ?
                            <View style={{ height: 100, borderColor: '#5ec3f2', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center' }}>
                                <ActivityIndicator size='large' />
                            </View>
                            :
                            <View style={{ minHeight: height / 4, padding: 5, borderColor: '#5ec3f2', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', justifyContent: 'space-around' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {this.state.item.types == 'gas' ?
                                        <Image source={require('../pictures/gas.png')} style={{ width: 70, height: 70 }} />
                                        :
                                        <View style={{ width: 70, alignItems: 'center' }}>
                                            <Image source={require('../pictures/atm.png')} style={{ width: 50, height: 70 }} />
                                        </View>
                                    }
                                    <View style={{ padding: 5, flex: 7 }}>
                                        <Text style={styles.infoName}>{this.state.item.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ paddingTop: 5, width: 12, alignItems: 'center' }}>
                                                <Image source={require('../pictures/address.png')} style={{ width: 8, height: 12 }} />
                                            </View>
                                            <Text style={styles.infoAddress}> {this.state.item.address}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{ flex: 1 }} onPress={this.onPressHeartButton.bind(this, this.state.item)}>
                                            {this.renderHeart(this.state.item)}
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => Linking.openURL('google.navigation:q=' + this.state.item.latitude + '+' + this.state.item.longitude)}>
                                            <Image source={require('../pictures/gps.png')} style={{ width: 30, height: 30 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.setState({ mode: 'walking' })}>
                                            <Image source={require('../pictures/open.png')} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                        <Text style={{ color: 'black' }}>  {this.state.item.open_close}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.setState({ mode: 'walking' })}>
                                            <Image source={require('../pictures/phone.png')} style={{ width: 23, height: 23 }} />
                                        </TouchableOpacity>
                                        <Text> </Text>
                                        <Text style={{ color: 'black', textDecorationLine: 'underline' }} onPress={() => { Linking.openURL('tel:' + this.state.item.phone); }}>{this.state.item.phone}</Text>
                                    </View>
                                    {this.state.mode == 'driving' ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({ mode: 'walking' })}>
                                                <Image source={require('../pictures/driving.png')} style={{ width: 25, height: 25 }} />
                                            </TouchableOpacity>
                                            <Text style={{ color: 'black' }}> {this.state.driving}</Text>
                                        </View>
                                        :
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({ mode: 'driving' })}>
                                                <Image source={require('../pictures/walking.png')} style={{ width: 25, height: 25 }} />
                                            </TouchableOpacity>
                                            <Text style={{ color: 'black' }}> {this.state.walking}</Text>
                                        </View>
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Info', { item: this.state.item, distance: this.state.distanceDriving, duration: this.state.driving })}>
                                        <Text style={{ color: 'black' }}>Chi tiết</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { this.setState({ direct: true }), this.map.fitToSuppliedMarkers(['mk1', 'mk2'], { edgePadding: { top: 100, right: 150, bottom: height / 2, left: 150 } }) }}>
                                        <Image source={require('../pictures/distance.png')} style={{ width: 25, height: 25 }} />
                                        {this.state.mode == 'driving' ?
                                            <Text style={{ color: 'black' }}> {this.state.distanceDriving}</Text>
                                            :
                                            <Text style={{ color: 'black' }}> {this.state.distanceWalking}</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View> : <View />
                }
            </View >
        );
    }
}