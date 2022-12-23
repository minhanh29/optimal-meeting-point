import React, { useState, useEffect } from 'react'
import { FlatList, View, TouchableOpacity, Animated, Alert } from 'react-native'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import { db } from "../../firebaseConfig"
import { doc, setDoc, addDoc, onSnapshot, query, collection, where, getDoc, GeoPoint } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
} from "../../redux/reducers/userSlice"
import CheckBox from 'expo-checkbox';
import Spinner from 'react-native-loading-spinner-overlay';

import Card from "./Card"
import styles from "./styles"

const STATUS_PENDING = 0;
const STATUS_ACCEPTED = 1;
const STATUS_REJECTED =2;

const FriendRequests = () => {
	const { colors } = useTheme();

	const [selectAll, setSelectAll] =useState(false);
	const [loaded, setLoaded]=useState(false);
	const [data, setData] = useState([])
	const [checkedBoxes, setCheckedBoxes] = useState([]);

	const {user} = useSelector(selectUser)
	
	return (
		<View>
			<Text>Friend</Text>
		</View>
	)
}

export default FriendRequests


