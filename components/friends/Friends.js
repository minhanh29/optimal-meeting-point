import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import { InstantSearch } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";
import InfiniteHits from "../search/InfiniteHits";

const Friends = () => {
  // const [showHits, setShowHits] = useState(false);
  // console.log(showHits)
  return (
    <View>
		<InstantSearch searchClient={searchClient} indexName="username">
         <SearchBox searchBoxName= "Search friend" />
         {/* {showHits ? <InfiniteHits/> : null} */}
         <InfiniteHits/>
      </InstantSearch>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({});
