import React from "react";
import lottery from "./lottery";
import web3 from "./web3";
import "./App.css";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: "",
      balance: "",
      players: [],
      amountOfEther: "",
      isEntering: null,
      message: "",
    };
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    console.log(manager, "from manager");
    this.setState({ manager });

    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ balance });
    const players = await lottery.methods.getPlayers().call();
    this.setState({ players });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ isEntering: true });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.amountOfEther, "ether"),
    });
    this.setState({
      message: "Please Wait !!!! \n your request is being processed right now",
    });
    this.setState({ players: [...this.state.players, accounts[0]] });
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ balance });
    this.setState({ amountOfEther: "" });
    this.setState({
      message: "You Have Entered the Competition Successfully!!!",
    });
  };

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Processing Picking a Winner" });
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    this.setState({ message: " A Winner has been Picked" });
  };
  render() {
    return (
      <div className='App'>
        the manager Address of the contract is <b>{this.state.manager}</b>
        <br /> <br />
        there are : <b>{this.state.players.length} </b>
        Players compete on this lotter on an :{" "}
        <b>{web3.utils.fromWei(this.state.balance)} </b>
        <br />
        <br />
        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.amountOfEther}
            onChange={(e) => this.setState({ amountOfEther: e.target.value })}
          />
          <button type='submit'>Submit</button>
        </form>
        <h2>
          {" "}
          Hint you can <b>not</b> pick a winner if you are <b>not</b> the
          Manager
        </h2>
        <button onClick={this.pickWinner}>Pick a Winner </button>
        <br />
        <h1> {this.state.message}</h1>
      </div>
    );
  }
}
export default App;
