import React, { Component } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, Linking, AsyncStorage } from 'react-native';
import { styles } from '../StyleSheet';
import Geolocation from '@react-native-community/geolocation';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

export default class Favorites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            currentPositionLatitude: 0,
            currentPositionLongitude: 0,
            fetching: false,
            distance: 0,
            duration: 0,
        }
    }
    onFocus = async () => {
        this.currentPosition();
        const response = await AsyncStorage.getItem('favorites');
        const listOfLikes = await JSON.parse(response) || [];
        this.setState({
            favorites: listOfLikes,
        });
    }
    currentPosition() {
        Geolocation.getCurrentPosition(
            (info) => this.getPosition(info.coords.latitude, info.coords.longitude),
            (error) => Alert.alert('Bạn cần bật vị trí để sử dụng ứng dụng này'),
            { enableHighAccuracy: false, timeout: 50000 }
        );
    }
    getPosition(latitude, longitude) {
        this.setState({
            currentPositionLatitude: latitude,
            currentPositionLongitude: longitude,
        })
    }
    fetchDistance(lat1, lon1, lat2, lon2, item) {
        this.setState({ fetching: true })
        let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + lat1 + ',' + lon1 + '&destination=' + lat2 + ',' + lon2 + '&key=AIzaSyDGRIkhrfyhXfwmzRRX6TTyZ6XmvAsW4Iw&fbclid';
        fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                console.log(responseJSON);
                this.props.navigation.navigate('Info', { item: item, distance: responseJSON.routes[0].legs[0].distance.text, duration: responseJSON.routes[0].legs[0].duration.text })
            })

    }
    async removeToFavorites(item) {
        const value = this.state.favorites.filter(x => x.id != item.id);
        await AsyncStorage.setItem('favorites',
            JSON.stringify(value));
        this.setState({
            favorites: value,
        });
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <NavigationEvents
                    onWillFocus={this.onFocus} />
                <View style={styles.headerBackground}>
                    <Text style={styles.bigWhite}>Địa điểm yêu thích</Text>
                </View>
                <ScrollView style={styles.listFavorites}>
                    <FlatList
                        data={this.state.favorites}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ padding: 5 }}>
                                    <TouchableOpacity style={{ padding: 5, borderColor: '#5ec3f2', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', justifyContent: 'space-around' }} onPress={() => this.props.navigation.navigate('MapList', { item: item })} >
                                        <View style={{ flexDirection: 'row', flex: 10 }}>
                                            {item.types == 'gas' ?
                                                <Image source={require('../pictures/gas.png')} style={{ width: 70, height: 70 }} />
                                                :
                                                <View style={{ width: 70, alignItems: 'center' }}>
                                                    <Image source={require('../pictures/atm.png')} style={{ width: 50, height: 70 }} />
                                                </View>
                                            }
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
                                                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.removeToFavorites(item) }}>
                                                    <Image source={require('../pictures/bookmarked.png')} style={{ width: 30, height: 30 }} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => Linking.openURL('google.navigation:q=' + item.latitude + '+' + item.longitude)}>
                                                    <Image source={require('../pictures/gps.png')} style={{ width: 30, height: 30 }} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity >
                                </View>
                            )
                        }}
                    />
                </ScrollView>
            </View>
        )
    }
}