import React, { Component } from 'react';
import { Text, TextInput, View, Image, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Keyboard, Linking, NetInfo, Alert, Platform, BackHandler, AsyncStorage } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { styles } from '../StyleSheet';
import { Item } from '../function/RenderItem';
import Geolocation from '@react-native-community/geolocation';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchLog } from '../function/SearchLog';
import { GetLog } from '../function/GetLog';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { FetchData } from '../function/FetchData';
import { History } from '../function/RenderHistory';
import { NavigationEvents } from 'react-navigation';
import { getDistance } from 'geolib';
import { ToHistory } from '../function/History';

let { height, width } = Dimensions.get('window');

const serviceGas = ['Petrolimex', 'Mipec', 'Redriver', 'Ron95-III', 'Ron95-IV', 'E5 Ron92-II', 'Do 0.001S-V', 'DO 0,05S-V', 'Dầu nhờn', 'Bảo hiểm', 'Sơn', 'Mazut', 'Nước giặt', 'Thay dầu', 'Nhà vệ sinh'];
const serviceATM = ['Agribank', 'BIDV', 'Vietcombank', 'Vietinbank', 'TP', 'MB', 'VP', 'VIB', 'ACB', 'MSB', 'PG', 'SHB', 'Sacombank', 'AB', 'SeABank', 'SaiGonBank', 'PublicBank', 'HSBC', 'HDBank', 'Eximbank', 'PVCombank', 'OceanBank', 'VietBank', 'VietABank', 'GPBank', 'Techcombank', 'Nộp tiền', 'Rút tiền', 'Vấn tin số dư', 'Chuyển tiền', 'Mở tài khoản thanh toán', 'Phát hành thẻ lấy ngay'];
const openTime = ['05:00 - 24:00', '05:30 - 22:00', '06:00 - 22:00', '06:00 - 22:30', '08:00 - 22:00', '24/24'];

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            item: {},
            latitude: 0,
            longitude: 0,
            regionLatitude: 0,
            regionLongitude: 0,
            regionLatitudeDelta: 0.01,
            regionLongitudeDelta: 0.01,
            currentPositionLatitude: 0,
            currentPositionLongitude: 0,
            search: '',
            location: true,
            isFocus: false,
            refresh: true,
            direct: false,
            history: '',
            selectedItems: [],
            confirm: false,
            itemInfo: [],
            oneInfo: false,
            directFilter: false,
            info: false,
            key: 0,
            distanceDriving: 0,
            distanceWalking: 0,
            driving: 0,
            walking: 0,
            fetching: false,
            mode: 'driving',
            favorites: [],
        }
    }
    handleBackButton = () => {
        Alert.alert(
            'Thoát ứng dụng',
            'Bạn có chắc muốn thoát?', [{
                text: 'HỦY',
            }, {
                text: 'ĐỒNG Ý',
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.currentPosition();
        this.getLog();
        FetchData.data().then(res => {
            this.setState({
                isLoading: false,
                dataSource: res,
            })
        })
        if (Platform.OS === "android") {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected == false) {
                    Alert.alert("You are offline!");
                }
            });
        } else {
            // For iOS devices
            NetInfo.isConnected.addEventListener(
                "connectionChange",
                this.handleFirstConnectivityChange
            );
        }
        this.updateList();
    }
    fetchDistance(lat1, lon1, lat2, lon2) {
        let key = 'AIzaSyDO2cMTkAJG0fXbLCCKKiEyBPPGiItEgF4';
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
            (error) => Alert.alert('Bạn cần bật vị trí để sử dụng ứng dụng này'),
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
        this.clearAll();
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
            oneInfo: false,
        })
        this.getLog();
        Keyboard.dismiss();
    }
    clearAll() {
        this.setState({
            confirm: false,
            selectedItems: [],
            isFocus: false,
            info: false,
            oneInfo: false,
            direct: false,
            directFilter: false,
        })
        this.getLog();
        Keyboard.dismiss();
    }
    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    }
    onSelectedConfirm = () => {
        this.setState({
            latitude: 0,
            longitude: 0,
            confirm: true,
            oneInfo: false,
            info: false,
            direct: false,
            directFilter: false,
        })
    }
    getTypes() {
        let names = [];

        names[0] = this.state.dataSource[0].types;

        let x = 1;

        for (let i = 1; i < this.state.dataSource.length; i++) {
            let dem = 0;
            for (let j = 0; j < x; j++) {
                if (this.state.dataSource[i].types == names[j]) {
                    dem++;
                }
            }

            if (dem == 0) {
                names[x] = this.state.dataSource[i].types;
                x++;
            }
        }

        return names;
    }
    result(types) {
        let result = [];

        if (types == serviceGas) {
            result.push({
                id: 'Gần tôi gas',
                name: 'Gần nhất'
            })
        } else if (types == serviceATM) {
            result.push({
                id: 'Gần tôi ATM',
                name: 'Gần nhất'
            })
        }

        for (let i = 0; i < types.length; i++) {
            result.push({
                id: types[i],
                name: types[i]
            });
        }

        return result;
    }
    resultOpenTime() {
        let result = [];

        for (let i = 0; i < openTime.length; i++) {
            result.push({
                id: openTime[i],
                name: openTime[i]
            })
        }

        return result;
    }
    renderItems() {
        let items = [];
        for (let i = 0; i < this.getTypes().length; i++) {

            if (this.getTypes()[i] == 'gas') {
                items.push({
                    name: 'Trạm xăng',
                    id: 'Trạm xăng',
                    children: this.result(serviceGas)
                })

            } else if (this.getTypes()[i] == 'ATM') {
                items.push(
                    {
                        name: 'ATM',
                        id: 'ATM',
                        children: this.result(serviceATM)
                    }
                )
            }
        }

        items.push({
            name: 'Thời gian mở cửa',
            id: 'Thời gian mở cửa',
            children: this.resultOpenTime()
        })

        return items;
    }
    directFilter() {
        return (
            <MapViewDirections
                origin={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }}
                destination={{ latitude: this.state.itemInfo.latitude, longitude: this.state.itemInfo.longitude }}
                apikey={'AIzaSyDO2cMTkAJG0fXbLCCKKiEyBPPGiItEgF4'}
                strokeWidth={3}
                strokeColor='#c84bc8'
            />
        )
    }
    animate(data) {
        this.state.item = data;
        this.setState({
            itemInfo: data,
            info: true,
            direct: false,
            regionLatitude: data.latitude,
            regionLongitude: data.longitude
        })
    }
    markerFilter(data, key) {
        this.state.item = data;
        let str = '' + key;
        if (this.state.item.types == 'gas') {
            return (
                <Marker
                    key={key}
                    coordinate={{ latitude: this.state.item.latitude, longitude: this.state.item.longitude }}
                    onPress={() => { this.animate(data), this.setState({ key: str, directFilter: false }), this.fetchDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, data.latitude, data.longitude) }}
                    identifier={str}
                >
                    <Image source={require('../pictures/pointer_gas.png')} style={{ width: 40, height: 50 }} />
                </Marker>
            )
        }
        if (this.state.item.types == 'ATM') {
            return (
                <Marker
                    key={key}
                    coordinate={{ latitude: this.state.item.latitude, longitude: this.state.item.longitude }}
                    onPress={() => { this.animate(data), this.setState({ key: str, directFilter: false }), this.fetchDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, data.latitude, data.longitude) }}
                    identifier={str}
                >
                    <Image source={require('../pictures/pointer_atm.png')} style={{ width: 40, height: 50 }} />
                </Marker>
            )
        }
    }
    removeItem(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
    getDistance(lat1, lon1, lat2, lon2) {
        var dis = getDistance(
            { latitude: lat1, longitude: lon1 },
            { latitude: lat2, longitude: lon2 },
        );
        var distance = dis / 1000;
        return distance;
    }
    checkOpenClose() {
        for (let i = 0; i < openTime.length; i++) {
            if (this.state.selectedItems.includes(openTime[i])) {
                return true;
            }
        }
        return false;
    }
    checkOnceOpenClose() {
        let count = 0;
        for (let i = 0; i < openTime.length; i++) {
            if (this.state.selectedItems.includes(openTime[i])) {
                count++;
            }
        }
        if (count == 1) {
            return true;
        }
        return false;
    }
    getOnceOpenClose() {
        let count = 0;
        let result = null;
        for (let i = 0; i < openTime.length; i++) {
            if (this.state.selectedItems.includes(openTime[i])) {
                count++;
                result = openTime[i];
            }
        }
        if (count == 1) {
            return result;
        }
        return null;
    }
    checkContains() {
        let items = [];
        let dis = [];
        let dataCoor = [];
        let index = -1;
        let check = 0;
        let arr = [];


        if (this.state.selectedItems.length != 0) {

            for (let i = 0; i < this.state.dataSource.length; i++) {
                if (this.state.selectedItems.includes("Gần tôi ATM") == false && this.state.selectedItems.includes("Gần tôi gas") == false && this.checkOpenClose() == false) {
                    if (this.state.selectedItems.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                        items.push(this.markerFilter(this.state.dataSource[i], i));
                    }
                } else {

                    if (this.state.selectedItems.includes("Gần tôi ATM") && this.state.dataSource[i].types == 'ATM') {
                        if (this.checkOpenClose() == false) {
                            arr = this.removeItem(this.state.selectedItems, "Gần tôi ATM");
                            if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                                dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                                dataCoor.push(this.state.dataSource[i]);
                                check = 1;
                            }
                            this.state.selectedItems.push("Gần tôi ATM");
                        } else {
                            if (this.checkOnceOpenClose()) {
                                if (this.state.dataSource[i].open_close == this.getOnceOpenClose()) {
                                    const time = this.getOnceOpenClose();
                                    arr = this.removeItem(this.state.selectedItems, "Gần tôi ATM");
                                    arr = this.removeItem(this.state.selectedItems, this.getOnceOpenClose());
                                    if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                                        dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                                        dataCoor.push(this.state.dataSource[i]);
                                        check = 1;
                                    }
                                    this.state.selectedItems.push("Gần tôi ATM");
                                    this.state.selectedItems.push(time);
                                }
                            }
                        }
                    }
                }
                if (this.state.selectedItems.includes("Gần tôi gas") && this.state.dataSource[i].types == 'gas') {
                    if (this.checkOpenClose() == false) {
                        arr = this.removeItem(this.state.selectedItems, "Gần tôi gas");
                        if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                            dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                            dataCoor.push(this.state.dataSource[i]);
                            check = 2;
                        }
                        this.state.selectedItems.push("Gần tôi gas");
                    } else {
                        if (this.checkOnceOpenClose()) {
                            if (this.state.dataSource[i].open_close == this.getOnceOpenClose()) {
                                const time = this.getOnceOpenClose();
                                arr = this.removeItem(this.state.selectedItems, "Gần tôi gas");
                                arr = this.removeItem(this.state.selectedItems, this.getOnceOpenClose());
                                if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                                    dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                                    dataCoor.push(this.state.dataSource[i]);
                                    check = 2;
                                }
                                this.state.selectedItems.push("Gần tôi gas");
                                this.state.selectedItems.push(time);
                            }
                        }
                    }
                }

                if (this.checkOnceOpenClose() && this.state.selectedItems.includes("Gần tôi gas") == false && this.state.selectedItems.includes("Gần tôi ATM") == false) {
                    if (this.getOnceOpenClose() == this.state.dataSource[i].open_close) {
                        const time = this.getOnceOpenClose();
                        arr = this.removeItem(this.state.selectedItems, this.getOnceOpenClose());
                        if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                            items.push(this.markerFilter(this.state.dataSource[i], i));
                        }
                        this.state.selectedItems.push(time);
                    }
                }
            }
        }


        index = dis.indexOf(Math.min.apply(Math, dis));
        if (check == 1) {
            items.push(this.markerFilter(dataCoor[index], "keyATM"));
        }
        if (check == 2) {
            items.push(this.markerFilter(dataCoor[index], "keyGas"));
        }

        return items;
    }
    markOneItem() {
        let items = [];
        items.push(<Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
            onPress={() => { this.setState({ oneInfo: true, direct: true }), this.getLog(); }}
        >
            {this.state.item.types == 'gas' ? <Image source={require('../pictures/pointer_gas.png')} style={{ width: 60, height: 60 }} />
                : this.state.item.types == 'ATM' ? <Image source={require('../pictures/pointer_atm.png')} style={{ width: 60, height: 60 }} />
                    : <View />}
        </Marker>)
        return items;
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
        const { search } = this.state
        const onFocus = () => this.setState({ isFocus: true, info: false, oneInfo: false })
        let str = this.state.key
        let item = this.state.itemInfo
        if (this.state.isLoading) {
            return (
                <View style={{ height: '100%', justifyContent: 'center', backgroundColor: 'transparent' }}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this.onFocus} />
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
                            onPress={() => { this.clear(), this.currentPosition() }} identifier='mk1' /> : <View />
                    }
                    {this.state.latitude != 0 && this.state.longitude != 0 ?
                        <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                            onPress={() => { this.setState({ oneInfo: true }), this.getLog(), this.fetchDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.item.latitude, this.state.item.longitude) }} identifier='mk2'
                        >
                            {this.state.item.types == 'gas' ? <Image source={require('../pictures/pointer_gas.png')} style={{ width: 40, height: 50 }} />
                                : this.state.item.types == 'ATM' ? <Image source={require('../pictures/pointer_atm.png')} style={{ width: 40, height: 50 }} />
                                    : <View />
                            }
                        </Marker> : <View />
                    }
                    {this.state.confirm ? this.checkContains() : <View />}
                    {this.state.direct ?
                        <MapViewDirections
                            origin={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }}
                            destination={{ latitude: this.state.item.latitude, longitude: this.state.item.longitude }}
                            apikey={'AIzaSyDO2cMTkAJG0fXbLCCKKiEyBPPGiItEgF4'}
                            strokeWidth={3}
                            strokeColor='#c84bc8'
                        /> : <View />
                    }
                    {this.state.directFilter ?
                        this.directFilter() : <View />
                    }
                </MapView>
                <View style={styles.headerMainPage}>
                    <View style={styles.findingBox}>
                        <Image source={require('../pictures/map.png')} style={{ width: 30, height: 30 }} />
                        <TextInput
                            style={{ width: width * 4 / 5, flex: 8 }}
                            placeholder='Tìm kiếm địa điểm'
                            onChangeText={this.updateSearch}
                            value={this.state.search}
                            maxLength={35}
                            onFocus={onFocus}
                        />
                        {this.state.search != '' ?
                            <TouchableOpacity onPress={() => this.setState({ search: '' })}>
                                <Image source={require('../pictures/clear.png')} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity> : <View />
                        }
                        <SectionedMultiSelect
                            items={this.renderItems()}
                            IconRenderer={Icon}
                            uniqueKey="id"
                            subKey="children"
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            onConfirm={this.onSelectedConfirm}
                            selectedItems={this.state.selectedItems}
                            style={{ flex: 1 }}
                            showChips={false}
                            searchPlaceholderText="Search"
                        />
                    </View>
                </View>
                {this.state.isFocus ?
                    <ScrollView style={styles.listSearch} keyboardShouldPersistTaps='handled'>
                        {this.state.search == '' ?
                            <FlatList
                                keyboardShouldPersistTaps='handled'
                                data={this.state.history}
                                renderItem={({ item }) => <History fun={() => this.updatePosition(ToHistory({ item: item, dataSource: this.state.dataSource }))} item={item} />}
                                extraData={this.state.refresh}
                            />
                            :
                            <FlatList
                                keyboardShouldPersistTaps='handled'
                                data={this.state.dataSource}
                                renderItem={({ item }) => <Item fun={() => this.updatePosition(item)} item={item} check={this.state.search} currentLat={this.state.currentPositionLatitude} currentLon={this.state.currentPositionLongitude} />}
                                extraData={this.state.refresh}
                            />
                        }
                    </ScrollView> : <View />
                }
                {this.state.info ?
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
                                        <Text style={styles.infoName}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ paddingTop: 5, width: 12, alignItems: 'center' }}>
                                                <Image source={require('../pictures/address.png')} style={{ width: 8, height: 12 }} />
                                            </View>
                                            <Text style={styles.infoAddress}> {item.address}</Text>
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
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.setState({ mode: 'walking' })}>
                                            <Image source={require('../pictures/open.png')} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                        <Text style={{ color: 'black' }}>  {item.open_close}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.setState({ mode: 'walking' })}>
                                            <Image source={require('../pictures/phone.png')} style={{ width: 23, height: 23 }} />
                                        </TouchableOpacity>
                                        <Text> </Text>
                                        <Text style={{ color: 'black', textDecorationLine: 'underline' }} onPress={() => { Linking.openURL('tel:' + item.phone); }}>{item.phone}</Text>
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
                                    <TouchableOpacity style={styles.button} onPress={() => { this.setState({ directFilter: true }), this.map.fitToSuppliedMarkers(['mk1', str], { edgePadding: { top: 100, right: 150, bottom: height / 2, left: 150 }, animated: true }) }}>
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