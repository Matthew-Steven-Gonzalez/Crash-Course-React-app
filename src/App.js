import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";
import { async } from "q";

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

function App() {

  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");



  useEffect(function () {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.
        from('Facts')
        .select('*')

      if (currentCategory !== "all") query = query.eq
        ("category", currentCategory);

      const { data: Facts, error } = await query
        .order('thumbsUp', { ascending: false });

      setIsLoading(false);

      if (!error) setFacts(Facts);
      else alert("Error retriving data.")
    }
    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? <NewFactForm setFacts={setFacts}
        setShowForm={setShowForm} /> : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {isLoading ? <Loader /> : <FactsList facts={facts} setFacts={setFacts} />}



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
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event) {
    //1.Prevent browser reload
    event.preventDefault();

    //2.Check if data is Valid
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      console.log("All three")
    }

    //3.Create new fact object
    // const newFact = {
    //   id: Math.round(Math.random() * 10000000),
    //   text,
    //   source,
    //   category,
    //   votesInteresting: 0,
    //   votesMindblowing: 0,
    //   votesFalse: 0,
    //   createdIn: new Date().getFullYear(),
    // }

    //3.upload fact to supebass api and recieve new fact
    setIsUploading(true);
    const { data: newfact, error } = await supabase.from("Facts").insert([{ text, source, category }]).select();

    console.log(newfact);

    //4.add fact to new UI/State

    if (!error) setFacts((facts) => [newfact[0], ...facts]);

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
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select name="" id="" value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choice Category</option>
        {CATEGORIES.map((cat) =>
          <option
            key={cat.name}
            value={cat.name}>{cat.name.toUpperCase()}
          </option>)}
      </select>
      <button className="btn btn-large" disabled={isUploading}>Post</button>
    </form>);
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li>
          <button className="btn btn-all-cat"
            onClick={() => setCurrentCategory("all")}>All</button>
        </li>
        {CATEGORIES.map((cat) => <li key={cat.name}>
          <button style={{ backgroundColor: cat.color }} className="btn btn-cat"
            onClick={() => setCurrentCategory(cat.name)}>{cat.name}</button>
        </li>)}
      </ul>
    </aside>
  );
}

function FactsList({ facts, setFacts }) {

  if (facts.length === 0) {
    return <p className="loader">There are no facts in the category, Maybe add one.</p>
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVote() {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("Facts")
      .update({ thumbsUp: fact.thumbsUp + 1 })
      .eq("id", fact.id)
      .select();

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    setIsUpdating(false);
  }

  return (
    <li className="fact">
      <p> {fact.text}
        <a className="source"
          href={fact.source}
          target="_blank">(Source)</a>
      </p>
      <span className="tag" style={{ backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color }}>{fact.category}</span>

      <div className="vote-buttons">
        <button onClick={handleVote} disabled={isUpdating}>👍 {fact.thumbsUp}</button>
        <button>🤯 {fact.mindBlowing}</button>
        <button>⛔️ {fact.falseFact}</button>
      </div>

    </li>
  );
}


export default App;