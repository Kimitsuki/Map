import React, { Component } from 'react';
import IonIcons from 'react-native-ionicons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import MainPage from './component/MainPage';
import List from './component/List';
import Info from './component/Info';

export const ListStack = createStackNavigator({
    MainPage: {
        screen: MainPage,
    },
    Info: {
        screen: Info,
    }
},
    {
        headerMode: 'none',
    });

export const Router = createAppContainer(createBottomTabNavigator({
    Map: {
        screen: ListStack,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <IonIcons name='globe' color={tintColor} size={28} />
            )
        }
    },
    List: {
        screen: List,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <IonIcons name='list' color={tintColor} size={25} />
            )
        }
    },
},
    {
        tabBarOptions: {
            activeTintColor: '#5ec3f2',
            inactiveTintColor: 'grey'
        }
    }));
