// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the Chainlink interface for interacting with price feeds
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// Import our custom library for converting ETH to USD
import "./PriceConverter.sol";

/**@title A contract for crowdfunding a project
 * @author Abdul Majid
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as a library
 */
contract FundMe {
  // Use the PriceConverter library for uint256 types
  using PriceConverter for uint256;

  // Mapping of addresses to amounts funded
  mapping(address => uint256) public s_addressToAmountFunded;
  // Array of funders
  address[] public s_funders;
  // Owner of the contract
  address public immutable i_owner;
  // Price feed contract from Chainlink
  AggregatorV3Interface public s_priceFeed;

  // Constructor function, called when the contract is deployed
  constructor(address priceFeedAddress) {
    // Set the price feed contract
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    // Set the owner of the contract to the address that deployed it
    i_owner = msg.sender;
  }

  /**
   * @notice Function for funding the contract
   * @dev This function requires that the amount of ETH sent is greater than or equal to the minimum amount of USD
   */
  function fund() public payable {
    // Set the minimum amount of USD needed to fund the contract
    uint256 minimumUSD = 50 * 10**18;
    // Require that the amount of ETH sent is greater than or equal to the minimum amount of USD
    require(
      msg.value.getConversionRate(s_priceFeed) >= minimumUSD,
      "You need to spend more ETH!"
    );
    // Increase the amount funded for the sender's address
    s_addressToAmountFunded[msg.sender] += msg.value;
    // Add the sender's address to the array of funders
    s_funders.push(msg.sender);
  }

  // Modifier for restricting access to the contract owner only
  modifier onlyOwner() {
    require(msg.sender == i_owner, "You are not the owner!");
    _;
  }

  // Function for withdrawing funds from the contract (only available to the owner)
  function withdraw() public payable onlyOwner {
    // Transfer the entire balance of the contract to the owner's address
    payable(msg.sender).transfer(address(this).balance);
    // Set the amount funded for all funders to 0
    for (
      uint256 funderIndex = 0;
      funderIndex < s_funders.length;
      funderIndex++
    ) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    // Clear the array of funders
    s_funders = new address[](0);
  }

  // Function for cheaper withdrawal of funds (only available to the owner)
  function cheaperWithdraw() public payable onlyOwner {
    // Transfer the entire balance of the contract to the owner's address
    payable(msg.sender).transfer(address(this).balance);
    // Create a new memory array of funders
    address[] memory funders = s_funders;
    // Loop through the array of funders and set the amount funded to 0 for each funder
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    // Clear the array of funders
    s_funders = new address[](0);
  }
}
