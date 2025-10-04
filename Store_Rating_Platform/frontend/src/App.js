import React, { useState, useEffect } from 'react';
const API = process.env.REACT_APP_API || 'http://localhost:4000/api';

function App(){
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token')||'');
  const [stores, setStores] = useState([]);
  useEffect(()=>{ fetchStores(); },[]);
  async function fetchStores(){
    const res = await fetch(API + '/stores');
    const data = await res.json();
    setStores(data);
  }
  async function login(e){
    e.preventDefault();
    const email = e.target.email.value, password = e.target.password.value;
    const res = await fetch(API + '/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data = await res.json();
    if (data.token){ setToken(data.token); localStorage.setItem('token', data.token); alert('Logged in'); }
    else alert('Login failed');
  }
  return (
    <div style={{padding:20,fontFamily:'sans-serif',maxWidth:900,margin:'auto'}}>
      <h1>Store Ratings - Demo</h1>
      {!token ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={login}>
            <input name="email" placeholder="email" /><br/>
            <input name="password" placeholder="password" type="password"/><br/>
            <button>Login</button>
          </form>
          <p>Use signup endpoint to create user via API or use admin to add users.</p>
        </div>
      ) : (
        <div>
          <button onClick={()=>{localStorage.removeItem('token'); setToken('');}}>Logout</button>
        </div>
      )}
      <h2>Stores</h2>
      <ul>
        {stores.map(s=>(
          <li key={s.id}><strong>{s.name}</strong> — {s.address} — Avg: {s.averageRating ? s.averageRating.toFixed(2) : 'NA'}</li>
        ))}
      </ul>
      <hr/>
      <p>This is a minimal frontend stub. Full UI (admin dashboards, owner dashboards, rating UI) is available to extend.</p>
    </div>
  );
}

export default App;
