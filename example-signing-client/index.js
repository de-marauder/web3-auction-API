const BASE_API_URL = 'http://localhost:9001/api/v1';
const beneficiary = document.getElementById('beneficiary-address');
const bidTime = document.getElementById('bidding-time');
const auctionId = document.getElementById('auctionId');
const bidValue = document.getElementById('bid-value');
const signButton = document.getElementById('signButton');
const bidButton = document.getElementById('make-a-bid');

let web3;
(async () => {
  // Check if MetaMask is available
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else {
    alert('Please install MetaMask to use this application');
  }

  signButton.addEventListener('click', onDeploy);
  bidButton.addEventListener('click', onBid);
})();

const onDeploy = async () => {
  if (!web3) return;
  if (!bidTime) throw new Error('bid time required');

  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const defaultAddress = accounts[0];
    // Fetch unsigned transaction from API (replace with your API call)
    const response = await fetch(
      `${BASE_API_URL}/auction/request-unsigned-deployment-transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer token',
        },
        body: JSON.stringify({
          beneficiaryAddress: `${beneficiary.value}`,
          biddingDuration: bidTime.value,
        }),
      },
    );
    const unsignedTxResponse = await response.json();

    const unsignedTx = unsignedTxResponse.data.unsignedTx;
    const { unsignedTxString: uTx, estimatedGas: gas } = unsignedTx;

    // Request user to sign the transaction
    const txParams = {
      from: defaultAddress,
      gasLimit: gas,
      gas,
      data: uTx,
    };
    console.log('txParams: ', txParams);

    const signedTxHash = await web3.eth.sendTransaction(txParams);
    console.log(signedTxHash);
    // Submit signed transaction to another API
    await fetch(`${BASE_API_URL}/auction/save-signed-deployment-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer token',
      },
      body: JSON.stringify({ signedTxHash: signedTxHash.transactionHash }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log('result: ', result);
        console.log('Transaction signed and submitted!');
      })
      .catch(() => {
        console.error('Error saving transaction: ', error);
      });
  } catch (error) {
    console.error('Error:', error);
    alert('Transaction signing failed!');
  }
};

const onBid = async () => {
  if (!web3) return;
  if (!bidValue.value) throw new Error('bid value required');
  if (!auctionId.value) throw new Error('Auction ID required');

  console.log('bid value: ', bidValue.value);

  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const defaultAddress = accounts[0];
    let txParams = {
      from: defaultAddress,
      to: '0xa162cc13859ee52753bc5910aedb5571f6588d1c', // contract address
      value: bidValue.value,
    };
    // Fetch unsigned transaction from API
    fetch(`${BASE_API_URL}/auction/${auctionId.value}/request-unsigned-bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer token',
      },
      body: JSON.stringify(txParams),
    })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json);
        return json;
      })
      .then(async (unsignedTxResponse) => {
        const { unsignedTx: uTx, estimatedGas: gas } = unsignedTxResponse.data;

        // Request user to sign the transaction
        txParams = {
          from: defaultAddress,
          to: '0x19aef95039842bced970c715c201e8041abe19b7', // contract address
          value: '0x' + web3.utils.toWei(bidValue.value, 'ether'),
          gas,
          data: uTx,
        };
        const signedTxHash = await web3.eth.sendTransaction(txParams);
        console.log(signedTxHash);
        // Submit signed transaction to another API
        await fetch(
          `${BASE_API_URL}/auction/${auctionId.value}/save-signed-bid`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: 'Bearer token',
            },
            body: JSON.stringify({ signedTxHash, value: bidValue }),
          },
        )
          .then((res) => res.json())
          .then((result) => {
            console.log('result: ', result);
            console.log('Transaction signed and submitted!');
          })
          .catch(() => {
            console.error('Error saving transaction: ', error);
          });
      })
      .catch((error) => {
        console.error('Transation failed: ', error);
      });
  } catch (error) {
    console.error('Error:', error);
    alert('Transaction signing failed!');
  }
};
