import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleDisplayForm() {
    setDisplayAddForm((disply) => !disply);
    setSelectedFriend(null);
  }
  function addFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setDisplayAddForm(false);
  }
  function handleSelection(friend) {
    // console.log(friend);
    setSelectedFriend(selectedFriend?.id === friend.id ? null : friend);
    setDisplayAddForm(false);
  }
  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {displayAddForm && <FormAddFriend addFriends={addFriends} />}
        <Button onClick={handleDisplayForm}>
          {displayAddForm ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "select" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function FormAddFriend({ addFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleAddFriend(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    if (!name || !image) return;
    const newFriend = { id, name, image: `${image}?u=${id}`, balance: 0 };

    addFriends(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label htmlFor="">👩🏼‍🤝‍🧑🏻friend name</label>
      <input
        type="text"
        placeholder="friend's name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <label htmlFor=""> 🌆image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => {
          setImage(e.target.value);
        }}
      />
      <Button>add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [totalBill, setTotalBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense =
    totalBill && totalBill > userExpense ? totalBill - userExpense : 0;
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmitBill(e) {
    e.preventDefault();
    if (!totalBill || !userExpense || totalBill < userExpense) return;
    handleSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmitBill}>
      <h2>split bill with {selectedFriend.name}</h2>
      <label htmlFor="">💰bill value</label>
      <input
        type="text"
        value={totalBill}
        onChange={(e) => {
          if (e.target.value > 0) setTotalBill(+e.target.value);
        }}
      />
      <label htmlFor="">🧑your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) => {
          if (e.target.value <= totalBill) setUserExpense(+e.target.value);
        }}
      />
      <label htmlFor="">👩🏼‍🤝‍🧑🏻{selectedFriend.name} expense</label>
      <input type="text" disabled value={friendExpense} />
      <label htmlFor="">🤑who is paying</label>
      <select
        value={whoIsPaying}
        onChange={(e) => {
          setWhoIsPaying(e.target.value);
        }}
      >
        <option value="user">User</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default App;
