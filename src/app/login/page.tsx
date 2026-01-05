'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { createUser } from '@/utils/db/actions'

const clientId = "BACp_7zIMu0uTB_7w7xuABXqJe7f5mqdl_ESJdyWrpw0Iw7xgtFUYWElmZ99NZrhkCTaeA41svcPWUmnOQy5V2s";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider,
});

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing Web3Auth...");
        await web3auth.initModal();
        console.log("Web3Auth initialized, connected:", web3auth.connected);
        if (web3auth.connected) {
          setLoggedIn(true);
          router.push('/report');
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
        alert("Failed to initialize Web3Auth. Please refresh the page and try again.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const login = async () => {
    console.log("Login button clicked");
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      alert("Web3Auth is not initialized yet. Please wait and try again.");
      return;
    }
    try {
      console.log("Connecting to Web3Auth...");
      const web3authProvider = await web3auth.connect();
      console.log("Connected, getting user info...");
      const user = await web3auth.getUserInfo();
      console.log("User info:", user);
      
      if (user.email) {
        localStorage.setItem('userEmail', user.email);
        await createUser(user.email, user.name || 'Anonymous User');
        setLoggedIn(true);
        router.push('/report');
      } else {
        alert("Unable to get user email. Please try again or use a different login method.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check the console for details and try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Logged in successfully! Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one to report waste and earn rewards
          </p>
        </div>
        <div className="mt-8">
          <Button
            onClick={login}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
          >
            Sign In / Sign Up with Web3Auth
          </Button>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            New users will be automatically registered. By signing in, you agree to help make waste management better!
          </p>
        </div>
      </div>
    </div>
  );
}