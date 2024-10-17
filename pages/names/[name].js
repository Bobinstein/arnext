import Header from "@/components/Header";
import { useParams, Link } from "@/arnext"; // Import your custom useParams
import { useEffect, useState } from "react";
import { IO, ANT } from "@ar.io/sdk/web";
import { fetchRecordDetails } from "@/utils/arweave";

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
  const [newSubdomain, setNewSubdomain] = useState("");
  const [newTxId, setNewTxId] = useState("");
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
    try {
      // Placeholder for record update logic
      const io = IO.init();
      await io.updateArNSRecord({ name: nameState, key, txId });
      setResultMessage(`Record for ${key} updated successfully!`);

      // Update the record state to reflect the changes
      setRecord((prevRecord) => {
        return {
          ...prevRecord,
          records: {
            ...prevRecord.records,
            [key]: { ...prevRecord.records[key], transactionId: txId },
          },
        };
      });
    } catch (error) {
      setResultMessage("Failed to update the record. Please try again.");
    }
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
                        onBlur={(e) =>
                          handleUpdateRecord(
                            recordKey === "@" ? record.key : `${recordKey}`,
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          handleUpdateRecord(
                            recordKey === "@" ? "@" : `${recordKey}`,
                            newTxId
                          )
                        }
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
                value={newSubdomain}
                onChange={(e) => setNewSubdomain(e.target.value)}
              />
              <input
                type="text"
                placeholder="New TxID"
                value={newTxId}
                onChange={(e) => setNewTxId(e.target.value)}
              />
              <button
                onClick={() => handleUpdateRecord(`${newSubdomain}`, newTxId)}
              >
                Set New Record
              </button>
            </div>
          </>
        )}
        <Link href="/">
          <button>Back to list</button>
        </Link>

        {resultMessage && <p>{resultMessage}</p>}
      </div>
    </div>
  );
}
