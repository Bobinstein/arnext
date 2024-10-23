import Header from "@/components/Header";
import { useParams, Link } from "@/arnext"; // Import your custom useParams
import { useEffect, useState } from "react";
import { IO } from "@ar.io/sdk/web";
import { fetchRecordDetails, setANTRecord } from "@/utils/arweave";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { name } = params;
  return { props: { name } }; // No initial record, just returning name
}

export default function NamePage() {
  const { name } = useParams();
  const [nameState, setNameState] = useState("");
  const [nameRecord, setNameRecord] = useState(null); // Initialize record to null
  const [arnsRecord, setArnsRecord] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [address, setAddress] = useState(null); // State for wallet address

  useEffect(() => {
    console.log("using effect");
    if (name && name !== nameState) {
      setNameState(name);

      // Fetch the record dynamically whenever routeName changes
      const fetchRecord = async () => {
        console.log("fetching records");
        try {
          const io = IO.init();
          const newRecord = await io.getArNSRecord({ name });
          console.log(newRecord);
          setNameRecord(newRecord);
        } catch (error) {
          console.error("Failed to fetch record:", error);
          setRecord(null);
        }
      };

      fetchRecord();
    }
    if (nameRecord && nameRecord.processId) {
      const fetchArnsRecord = async () => {
        try {
          const arnsRecord = await fetchRecordDetails(nameRecord.processId);
          console.log(arnsRecord);
          setArnsRecord(arnsRecord);
        } catch (error) {
          console.error(error);
        }
      };
      fetchArnsRecord();
    }
  }, [nameState, nameRecord]);

  const handleUpdateRecord = async (key, txId) => {
    const result = await setANTRecord(nameRecord.processId, key, txId, 900)
  console.log(`result Message: ${result}`)
  console.log(result)
    setResultMessage(result.id)
  };

  if (nameRecord === null) {
    return (
      <div>
        <Header address={address} setAddress={setAddress} />
        <p>Loading...</p>
      </div>
    );
  }

  const owner = arnsRecord?.owner || "N/A";
  const controllers = arnsRecord?.controllers || [];

  return (
    <div>
      <Header address={address} setAddress={setAddress} />
      <div className="record-details">
        <h3>Record Details for {nameState}</h3>
        <div>
          {arnsRecord?.detailedRecords &&
            Object.keys(arnsRecord.detailedRecords).map((recordKey, index) => (
              <div key={index} className="record-txid">
                <strong>{recordKey}:</strong>{" "}
                <a
                  href={`https://arweave.net/${arnsRecord.detailedRecords[recordKey].transactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {arnsRecord.detailedRecords[recordKey].transactionId}
                </a>
              </div>
            ))}
        </div>
        <p>Owner: {owner}</p>
        <p>
          Controllers: {controllers.length > 0 ? controllers.join(", ") : "N/A"}
        </p>
        {owner === address && ( // Replace "your-address-here" with logic for the current user's address
          <>
            {arnsRecord?.detailedRecords &&
              Object.keys(arnsRecord.detailedRecords).map(
                (recordKey, index) => (
                  <div key={index} className="record-update">
                    <label>
                      {recordKey}:
                      <input
                        type="text"
                        placeholder="Enter new TxID"
                        id={`input-${index}`}
                      />
                      <button
                        onClick={() => {
                          const inputElement = document.getElementById(`input-${index}`);
                          const inputValue = inputElement ? inputElement.value : "";
                          handleUpdateRecord(
                            recordKey === "@" ? "@" : `${recordKey}`,
                            inputValue
                          );
                        }}
                      >
                        Update
                      </button>
                    </label>
                  </div>
                )
              )}
            <div className="new-record">
              <input
                type="text"
                placeholder="New Subdomain"
                id={`new-subdomain-input`}
              />
              <input
                type="text"
                placeholder="New TxID"
                id={`new-txid-input`}
              />
              <button
                onClick={() => {
                  const subdomainElement = document.getElementById("new-subdomain-input");
                  const txIdElement = document.getElementById("new-txid-input");
            
                  const newSubdomainValue = subdomainElement ? subdomainElement.value : "";
                  const newTxIdValue = txIdElement ? txIdElement.value : "";
            
                  console.log(newSubdomainValue)
                  console.log(newTxIdValue)
                  handleUpdateRecord(newSubdomainValue, newTxIdValue);
                }}
              >
                Set New Record
              </button>
            </div>
          </>
        )}
        <Link href="/">
          <button>Back to list</button>
        </Link>

        {resultMessage && <p>Successfully updated with message ID: {resultMessage}</p>}
      </div>
    </div>
  );
}
