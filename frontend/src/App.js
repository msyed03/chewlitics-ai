import { useState } from "react";

function App() {
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");

  const submitMeal = async () => {
    await fetch("http://127.0.0.1:8000/meals/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        food_label: food,
        calories: parseFloat(calories)
      })
    });
    alert("Meal logged!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ChewliticsAI</h1>
      <input
        placeholder="Food Label"
        onChange={(e) => setFood(e.target.value)}
      />
      <input
        placeholder="Calories"
        type="number"
        onChange={(e) => setCalories(e.target.value)}
      />
      <button onClick={submitMeal}>Log Meal</button>
    </div>
  );
}

export default App;
