import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import styles from "./styles"

const Test = () => (
	<View>
		<Text>Hello</Text>
	</View>
)

const renderScene = SceneMap({
  first: Test,
  second: Test,
});

const Notifications = () => {
	const { colors } = useTheme();

	  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);
	return (
		<View style={{width: "100%", height: '100%', paddingTop: 50}}>
			<View style={{height: 200}}>
			    <TabView
					renderTabBar={(props) => <TabBar {...props} activeColor="red"/>}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: "80%"}}
    />
			</View>
		<Stack
			backgroundColor={colors.background}
			h="100%"
			w="100%"
			items="center"
			spacing={25}
		>
			<Spacer />
			<Flex
				direction="row"
				justify="between"
				w="80%"
				marginBottom={20}
			>
				<TouchableOpacity
					style={{
						...styles.buttonContainer,
						backgroundColor: colors.mainColor1,
						width: "45%"
					}}
					onPress={() => console.log("")}
				>
					<Text style={styles.buttonTitle} color="white">
						Accept
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						...styles.buttonContainer,
						backgroundColor: colors.mainColor2,
						width: "45%"
					}}
					onPress={() => console.log("")}
				>
					<Text style={styles.buttonTitle} color="white">
						Decline
					</Text>
				</TouchableOpacity>
			</Flex>
		</Stack>
		</View>
	)
}

export default Notifications
