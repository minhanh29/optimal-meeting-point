import { StyleSheet, Text, View, Button } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { InstantSearch } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";
import InfiniteHits from "../search/InfiniteHits";

const Friends = () => {
  return (
    <View>
		<InstantSearch searchClient={searchClient} indexName="username">
         <SearchBox/>
         <InfiniteHits/>
      </InstantSearch>
		<Text>Hello</Text>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({});
