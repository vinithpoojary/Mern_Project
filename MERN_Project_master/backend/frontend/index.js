const { useState } = React;
const API = "http://localhost:3000";

function App() {
    const [view, setView] = useState("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function signup() {
        const res = await fetch(`${API}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        alert(data.message);
        if (res.ok) setView("login");
    }

    async function login() {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            setMessage(`Access granted, ${username}!`);
            setView("home");
        } else {
            alert(data.message);
        }
    }

    async function checkAuth() {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/auth`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        alert(data.message || "Auth failed");
    }

    function logout() {
        localStorage.removeItem("token");
        setView("login");
    }

    return (
        <div className="container">
            <h2>NeonVault</h2>
            <h3>Secure access zone</h3>

            {view === "signup" && (
                <>
                    <input
                        placeholder="Create username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        placeholder="Create password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={signup}>Sign Up</button>
                    <p>
                        Already a member? <a onClick={() => setView("login")}>Login</a>
                    </p>
                </>
            )}

            {view === "login" && (
                <>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={login}>Login</button>
                    <p>
                        Don’t have an account? <a onClick={() => setView("signup")}>Sign up</a>
                    </p>
                </>
            )}

            {view === "home" && (
                <div className="home-card">
                    <h3>{message}</h3>
                    <p>Welcome to your secure vault!</p>
                    <button onClick={checkAuth}>Validate Token</button>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
