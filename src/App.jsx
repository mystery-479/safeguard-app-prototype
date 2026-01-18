import React, { useState, useEffect } from 'react';
import './App.css';
import { EmergencyContact, LostItem, TodoTask } from './models/AppModels.js';
import { StorageService } from './services/StorageService.js';
import { LocationService } from './services/LocationService.js';
import { EmergencyService } from './services/EmergencyService.js';
import { NotificationService } from './services/NotificationService.js';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [contacts, setContacts] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [todos, setTodos] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Load data on app start
    loadData();
    requestPermissions();
  }, []);

  const loadData = () => {
    const loadedContacts = StorageService.load(StorageService.KEYS.CONTACTS) || [];
    const loadedItems = StorageService.load(StorageService.KEYS.LOST_ITEMS) || [];
    const loadedTodos = StorageService.load(StorageService.KEYS.TODOS) || [];
    
    setContacts(loadedContacts);
    setLostItems(loadedItems);
    setTodos(loadedTodos);
  };

  const requestPermissions = async () => {
    await NotificationService.requestPermission();
  };

  const handleEmergency = async () => {
    try {
      const currentLocation = await LocationService.getCurrentPosition();
      setLocation(currentLocation);
      
      await EmergencyService.activateEmergency(contacts);
      alert('Emergency mode activated! Help is on the way.');
    } catch (error) {
      alert('Failed to activate emergency mode: ' + error.message);
    }
  };

  const renderHome = () => (
    <div className="home-view">
      <h1>🛡️ SafeGuard</h1>
      <p>Your personal safety companion</p>
      
      <div className="emergency-button">
        <button onClick={handleEmergency} className="emergency-btn">
          🚨 EMERGENCY SOS
        </button>
      </div>
      
      <div className="quick-actions">
        <button onClick={() => setCurrentView('contacts')}>👥 Contacts</button>
        <button onClick={() => setCurrentView('lost-found')}>🔍 Lost & Found</button>
        <button onClick={() => setCurrentView('todos')}>✅ To-Do</button>
      </div>
      
      {location && (
        <div className="location-info">
          <p>📍 Current Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="contacts-view">
      <h2>Emergency Contacts</h2>
      <button onClick={() => setCurrentView('home')}>← Back</button>
      
      <div className="contacts-list">
        {contacts.map(contact => (
          <div key={contact.id} className="contact-item">
            <h3>{contact.name}</h3>
            <p>{contact.phone}</p>
            <small>{contact.relationship}</small>
          </div>
        ))}
      </div>
      
      <button>Add Contact</button>
    </div>
  );

  const renderLostFound = () => (
    <div className="lost-found-view">
      <h2>Lost & Found</h2>
      <button onClick={() => setCurrentView('home')}>← Back</button>
      
      <div className="items-list">
        {lostItems.map(item => (
          <div key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <small>Status: {item.status}</small>
          </div>
        ))}
      </div>
      
      <button>Report Lost Item</button>
    </div>
  );

  const renderTodos = () => (
    <div className="todos-view">
      <h2>To-Do Tasks</h2>
      <button onClick={() => setCurrentView('home')}>← Back</button>
      
      <div className="todos-list">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <input type="checkbox" checked={todo.completed} readOnly />
            <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
            <small>{todo.dueDate}</small>
          </div>
        ))}
      </div>
      
      <button>Add Task</button>
    </div>
  );

  return (
    <div className="app">
      {currentView === 'home' && renderHome()}
      {currentView === 'contacts' && renderContacts()}
      {currentView === 'lost-found' && renderLostFound()}
      {currentView === 'todos' && renderTodos()}
    </div>
  );
}

export default App;