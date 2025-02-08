import contractsData from "../Data/contracts.json";

const CONTRACTS_KEY = "contracts_data";

const contractService = {
  getContracts: () => {
    const data = localStorage.getItem(CONTRACTS_KEY);
    if (!data) {
      localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contractsData));
      return contractsData;
    }
    return JSON.parse(data);
  },

  addContract: (contract) => {
    const contracts = contractService.getContracts();
    contracts.push({ id: Date.now(), ...contract });
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
  },

  deleteContract: (id) => {
    const contracts = contractService.getContracts().filter(contract => contract.id !== id);
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
  }
};

export default contractService;
