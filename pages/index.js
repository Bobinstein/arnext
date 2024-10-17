"use client";
import Head from "next/head";
import { Image, Input, Textarea, Flex, Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CloseIcon } from "@chakra-ui/icons";
import { AO } from "aonote";
import { concat } from "ramda";
import { isArweave, Link } from "@/arnext";
import { fetchArNSRecords } from "@/utils/arweave";
import RecordsGrid from "@/components/RecordsGrid";

export default function Home() {
  const [arnsRecords, setArnsRecords] = useState(null); // State for storing all ArNS records
  const [isProcessing, setIsProcessing] = useState(true); // State for processing indicator
  const [searchTerm, setSearchTerm] = useState("") // used to filter displayed results by search input
  const [address, setAddress] = useState(null); // State for wallet address
  // const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    const fetchRecords = async () => {
      const allRecords = await fetchArNSRecords();
      setArnsRecords(allRecords);
      setIsProcessing(false);
    };

    fetchRecords();
  }, []);

  return (
    <div>
      <Header address={address} setAddress={setAddress} />
      {isProcessing ? (
        "processing"
      ) : (
        <div>
          <h2>Search</h2>
          <input 
          type="text"
          value={searchTerm}
          className ="search-bar"
          onChange = {(e) => {setSearchTerm(e.target.value); console.log("running good")}}
          />
        <RecordsGrid
          keys={arnsRecords
            .map((r) => r.name)
            .filter((key) => key.toLowerCase().includes(searchTerm?.toLowerCase()))}
        /></div>
      )}
    </div>
  );
}
