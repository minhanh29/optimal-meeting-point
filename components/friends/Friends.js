import { StyleSheet, Text, View, Button } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import algoliasearch from "algoliasearch";
import { InstantSearch } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";

const Friends = () => {
  return (
    <View>
      <InstantSearch searchClient={searchClient} indexName="username">
         <SearchBox/>
      </InstantSearch>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({});
