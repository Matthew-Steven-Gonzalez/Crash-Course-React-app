import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";


const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App() {

  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoarding] = useState(false);
  useEffect(function () {
    async function getFacts() {
      setIsLoarding(true);
      const { data: Facts, error } = await supabase
        .from('Facts').select('*').order('thumbsUp', { ascending: true });
      setFacts(Facts);
      setIsLoarding(false);

    }
    getFacts();
  }, []);


  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? <NewFactForm setFacts={setFacts}
        setShowForm={setShowForm} /> : null}

      <main className="main">
        <CategoryFilter />

        {isLoading ? <Loader /> : <FactsList facts={facts} />}



      </main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>
}

function Header({ showForm, setShowForm }) {

  const appTitle = "Today-I-Learned";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I learned logo" />
        <h1>{appTitle}</h1>
      </div>
      <button className="btn btn-large formBtn"
        onClick={() => setShowForm((show) => !show)}>
        {showForm ? 'Cancel' : 'Share A Fact'}</button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  function handleSubmit(event) {
    //1.Prevent browser reload
    event.preventDefault();

    //2.Check if data is Valid
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      console.log("All three")
    }

    //3.Create new fact object
    const newFact = {
      id: Math.round(Math.random() * 10000000),
      text,
      source,
      category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0,
      createdIn: new Date().getFullYear(),
    }

    //4.add fact to new UI/State

    setFacts((facts) => [newFact, ...facts]);

    //5.reset input fields back to default

    setText('');
    setCategory('');
    setSource('');

    //6.close form

    setShowForm(false);

  }


  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{textLength - 200}</span>
      <input
        type="text"
        placeholder="Trustworthy Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select name="" id="" value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Choice Category</option>
        {CATEGORIES.map((cat) =>
          <option
            key={cat.name}
            value={cat.name}>{cat.name.toUpperCase()}
          </option>)}
      </select>
      <button className="btn btn-large">Post</button>
    </form>);
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li>
          <button className="btn btn-all-cat">All</button>
        </li>
        {CATEGORIES.map((cat) => <li key={cat.name}>
          <button style={{ backgroundColor: cat.color }} className="btn btn-cat">{cat.name}</button>
        </li>)}
      </ul>
    </aside>
  );
}

function FactsList({ facts }) {
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} />
        ))}
      </ul>
    </section>
  );
}


function Fact({ fact }) {

  const [value, incrementInterestingValue] = useState(fact.votesInteresting);
  return (
    <li className="fact">
      <p> {fact.text}
        <a className="source"
          href={fact.source}
          target="_blank">(Source)</a>
      </p>
      <span className="tag" style={{ backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color }}>{fact.category}</span>

      <div className="vote-buttons">
        <button>👍 {fact.thumbsUp}</button>
        <button>🤯 {fact.mindBlowing}</button>
        <button>⛔️ {fact.falseFact}</button>
      </div>

    </li>
  );
}


export default App;